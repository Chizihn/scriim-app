import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useContactsStore } from "@/store/useContactStore";
import { useThemeStore } from "@/store/useThemeStore";

export default function AddContactScreen() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const { addContact } = useContactsStore();
  const router = useRouter();
  const { theme, isDarkMode } = useThemeStore();

  const validatePhoneNumber = (number: string) => {
    // Basic validation - can be enhanced based on your requirements
    return /^\+?[0-9]{10,15}$/.test(number);
  };

  const handleAddContact = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a name");
      return;
    }

    if (!email) {
      Alert.alert("Error", "Please enter an email");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    addContact({
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
    });

    Alert.alert(
      "Success",
      `${name} has been added to your emergency contacts.`,
      [{ text: "OK", onPress: () => router.replace("/(tabs)/contacts") }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <View
        style={[styles.header, { backgroundColor: theme.headerBackground }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)/contacts")}
        >
          <Text style={[styles.backButtonText, { color: theme.headerText }]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.headerText }]}>
          Add Emergency Contact
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Contact Name</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          value={name}
          onChangeText={setName}
          placeholder="John James"
          placeholderTextColor={isDarkMode ? "#999" : "#777"}
          autoCapitalize="words"
        />

        <Text style={[styles.label, { color: theme.text }]}>Phone Number</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="08012345678"
          placeholderTextColor={isDarkMode ? "#999" : "#777"}
          keyboardType="phone-pad"
        />

        <Text style={[styles.label, { color: theme.text }]}>Contact Email</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          value={email}
          onChangeText={setEmail}
          placeholder="@example.com"
          placeholderTextColor={isDarkMode ? "#999" : "#777"}
        />

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={handleAddContact}
        >
          <Text style={styles.addButtonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>
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
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  addButton: {
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 30,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
