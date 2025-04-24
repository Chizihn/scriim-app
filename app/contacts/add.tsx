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

export default function AddContactScreen() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const { addContact } = useContactsStore();
  const router = useRouter();

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
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)/contacts")}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Emergency Contact</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Contact Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter contact name"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Contact Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter contact email"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
          <Text style={styles.addButtonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#e74c3c",
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
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
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  addButton: {
    backgroundColor: "#e74c3c",
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
