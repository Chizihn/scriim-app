import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import NetInfo from "@react-native-community/netinfo";
import { useLocationStore } from "@/store/useLocationStore";
import { useContactsStore } from "@/store/useContactStore";
import { useThemeStore } from "@/store/useThemeStore";
import { sendPanic } from "@/services/api";
import { sendSMSDirectly } from "@/services/offline";
import PanicButton from "@/components/PanicButton";

export default function HomeScreen() {
  const { location, errorMsg, requestLocation } = useLocationStore();
  const { name, setname, contacts } = useContactsStore();
  const { theme, isDarkMode } = useThemeStore();
  const [isOnline, setIsOnline] = useState(true);
  const [nameInput, setNameInput] = useState(name);
  const [isEditingName, setIsEditingName] = useState(!name); // show name input if name doesn't exist
  const [isPanicActive, setIsPanicActive] = useState(false);
  const pulseAnim = useState(new Animated.Value(1))[0];
  const router = useRouter();

  useEffect(() => {
    requestLocation();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setNameInput(name);
  }, [name]);

  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation;

    if (isPanicActive) {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );

      pulseAnimation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
    };
  }, [isPanicActive, pulseAnim]);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setname(nameInput.trim());
      setIsEditingName(false);
    } else {
      Alert.alert("Error", "Please enter a valid name.");
    }
  };

  const handlePanic = async () => {
    if (!location) {
      Alert.alert(
        "Error",
        "Location is not available. Please enable location services."
      );
      return;
    }

    if (!name) {
      Alert.alert("Error", "Please set your name first.");
      return;
    }

    if (contacts.length === 0) {
      Alert.alert(
        "Error",
        "You have no emergency contacts. Please add at least one contact."
      );
      return;
    }

    try {
      setIsPanicActive(true); // Start pulsing animation
      if (isOnline) {
        const response = await sendPanic({
          name,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          contacts: contacts.map((contact) => ({
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            email: contact.email,
          })),
        });
        if (response.success) {
          Alert.alert("Success", "Panic alert sent successfully!");
        } else {
          Alert.alert(
            "Error",
            response.message || "Failed to send panic alert"
          );
        }
      } else {
        const message = `EMERGENCY ALERT from ${name}! I need help! My location: https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;

        let sentToAny = false;
        for (const contact of contacts) {
          const sent = await sendSMSDirectly(contact.phoneNumber, message);
          if (sent) sentToAny = true;
        }

        if (sentToAny) {
          Alert.alert(
            "Success",
            "Emergency SMS initiated. Please complete the sending process."
          );
        } else {
          Alert.alert(
            "Error",
            "Failed to send emergency SMS. Please try again or call emergency services directly."
          );
        }
      }
      setTimeout(() => setIsPanicActive(false), 2000);
    } catch (error) {
      console.error("Error sending panic:", error);
      Alert.alert("Error", "Failed to send panic alert. Please try again.");
      setIsPanicActive(false); // Stop pulsing animation on error
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <View
        style={[styles.header, { backgroundColor: theme.headerBackground }]}
      >
        <Text style={[styles.title, { color: theme.headerText }]}>
          {name ? `Hello, ${name}` : "Hello, Guest"}
        </Text>
        <Text style={[styles.subtitle, { color: theme.headerText }]}>
          Stay safe with your panic button
        </Text>

        {!isOnline && <Text style={styles.offlineText}>OFFLINE MODE</Text>}
      </View>

      {isEditingName && (
        <View
          style={[styles.userInfoContainer, { backgroundColor: theme.card }]}
        >
          <Text style={[styles.welcomeText, { color: theme.text }]}>
            Welcome to the Emergency App!
          </Text>
          <Text style={[styles.setupText, { color: theme.text }]}>
            Let's set up your profile first:
          </Text>
          <Text style={[styles.label, { color: theme.text }]}>Your Name:</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            value={nameInput}
            onChangeText={setNameInput}
            placeholder="Enter your name"
            placeholderTextColor={isDarkMode ? "#999" : "#777"}
          />
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleSaveName}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isEditingName && (
        <>
          <View
            style={[styles.locationContainer, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.label, { color: theme.text }]}>
              Location Status:
            </Text>
            <Text style={[styles.locationText, { color: theme.text }]}>
              {location
                ? `✅ Location available`
                : errorMsg
                ? `❌ ${errorMsg}`
                : "⏳ Getting location..."}
            </Text>
          </View>

          <View style={styles.panicContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <PanicButton
                onPress={handlePanic}
                disabled={!location || isPanicActive}
                isActive={isPanicActive}
              />
            </Animated.View>
          </View>

          <View
            style={[styles.statusContainer, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.statusText, { color: theme.text }]}>
              {contacts.length > 0
                ? `✅ ${contacts.length} emergency contacts`
                : "❌ No emergency contacts"}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
  },
  offlineText: {
    color: "#fff",
    backgroundColor: "#333",
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  userInfoContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  setupText: {
    fontSize: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 5,
    padding: 12,
    alignItems: "center",
    marginTop: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  locationContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  locationText: {
    fontSize: 16,
  },
  panicContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  statusContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
  },
});
