import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

import { sendPanic } from "../../services/api";
import { makePhoneCall } from "../../services/offline";
import { StatusBar } from "expo-status-bar";
import NetInfo from "@react-native-community/netinfo";
import { useLocationStore } from "@/store/useLocationStore";
import { useContactsStore } from "@/store/useContactStore";
import { useThemeStore } from "@/store/useThemeStore";

type AuthorityType = "police" | "hospital" | "fire";

interface Authority {
  type: AuthorityType;
  name: string;
  phoneNumber: string;
  email: string;
  color: string;
  darkColor?: string; // Add dark mode color
}

const authorities: Authority[] = [
  {
    type: "police",
    name: "Police",
    phoneNumber: "08109251030",
    email: "www.chizihn@gmail.com",
    color: "#3F51B5",
    darkColor: "#303F9F", // Darker shade for dark mode
  },
  {
    type: "hospital",
    name: "Hospital",
    phoneNumber: "08109251030",
    email: "www.chizihn@gmail.com",
    color: "#E91E63",
    darkColor: "#C2185B", // Darker shade for dark mode
  },
  {
    type: "fire",
    name: "Fire Rescue",
    phoneNumber: "08109251030",
    email: "www.chizihn@gmail.com",
    color: "#FF5722",
    darkColor: "#E64A19", // Darker shade for dark mode
  },
];

export default function AdvancedPanicScreen() {
  const { location, errorMsg } = useLocationStore();
  const { name, contacts } = useContactsStore();
  const { theme, isDarkMode } = useThemeStore();
  const [isOnline, setIsOnline] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthorityPanic = async (authority: Authority) => {
    if (!location) {
      Alert.alert(
        "Error",
        "Location is not available. Please enable location services."
      );
      return;
    }

    if (!name) {
      Alert.alert("Error", "Please set your name first on the home screen.");
      return;
    }

    setIsSending(true);

    try {
      if (isOnline) {
        const response = await sendPanic({
          name,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          authorityType: authority.type,
          contacts: authorities.map((contact) => ({
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            email: contact.email,
          })),
        });

        if (response.success) {
          Alert.alert("Success", `Emergency alert sent to ${authority.name}!`);
        } else {
          Alert.alert(
            "Error",
            response.message || `Failed to send alert to ${authority.name}`
          );
        }
      } else {
        Alert.alert(
          "Offline Mode",
          `You are offline. Would you like to call ${authority.name} directly?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Call Now",
              onPress: async () => {
                const success = await makePhoneCall(authority.phoneNumber);
                if (!success) {
                  Alert.alert(
                    "Error",
                    "Failed to initiate call. Please dial emergency services manually."
                  );
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error sending panic to authority:", error);
      Alert.alert(
        "Error",
        `Failed to send alert to ${authority.name}. Please try again.`
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <View
        style={[styles.header, { backgroundColor: theme.headerBackground }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: theme.headerText }]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.headerText }]}>
          Advanced Emergency
        </Text>
      </View>

      {!isOnline && (
        <View style={styles.offlineWarning}>
          <Text style={styles.offlineText}>
            OFFLINE MODE: Direct calls will be initiated
          </Text>
        </View>
      )}

      <ScrollView style={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Contact Authorities
        </Text>
        <Text
          style={[styles.description, { color: isDarkMode ? "#aaa" : "#666" }]}
        >
          Select an emergency service to contact directly. This will send your
          current location and personal details.
        </Text>

        <View style={styles.authoritiesContainer}>
          {authorities.map((authority) => (
            <TouchableOpacity
              key={authority.type}
              style={[
                styles.authorityButton,
                {
                  backgroundColor:
                    isDarkMode && authority.darkColor
                      ? authority.darkColor
                      : authority.color,
                },
              ]}
              onPress={() => handleAuthorityPanic(authority)}
              disabled={isSending}
            >
              <Text style={styles.authorityText}>{authority.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {isSending && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.primary }]}>
              Sending alert...
            </Text>
          </View>
        )}

        <View
          style={[
            styles.statusContainer,
            { backgroundColor: isDarkMode ? "#1A1A2E" : "#e8eaf6" },
          ]}
        >
          <Text style={[styles.statusLabel, { color: theme.text }]}>
            Status:
          </Text>
          <Text
            style={[styles.statusText, { color: isDarkMode ? "#ddd" : "#555" }]}
          >
            {location
              ? "✅ Location available"
              : errorMsg
              ? `❌ ${errorMsg}`
              : "⏳ Getting location..."}
          </Text>
          <Text
            style={[styles.statusText, { color: isDarkMode ? "#ddd" : "#555" }]}
          >
            {name ? `✅ User: ${name}` : "❌ Name not set"}
          </Text>
          <Text
            style={[styles.statusText, { color: isDarkMode ? "#ddd" : "#555" }]}
          >
            {isOnline ? "✅ Online mode" : "⚠️ Offline mode"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 25,
    flex: 1,
    textAlign: "left",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 22,
  },
  authoritiesContainer: {
    flexDirection: "column",
    marginBottom: 30,
  },
  authorityButton: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  authorityText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  statusContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 5,
  },
  offlineWarning: {
    backgroundColor: "#ffccbc",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 15,
    alignItems: "center",
  },
  offlineText: {
    color: "#d84315",
    fontWeight: "bold",
    fontSize: 14,
  },
});
