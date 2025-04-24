import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useContactsStore } from "@/store/useContactStore";
import { useThemeStore } from "@/store/useThemeStore";

export default function SettingsScreen() {
  const { name, setname } = useContactsStore();
  const [nameInput, setNameInput] = useState(name);
  const { isDarkMode, toggleTheme, theme } = useThemeStore();

  useEffect(() => {
    setNameInput(name);
  }, [name]);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setname(nameInput.trim());
      Alert.alert("Success", "Your name has been saved.");
    } else {
      Alert.alert("Error", "Please enter a valid name.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your personal information</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Name:</Text>
            <TextInput
              style={styles.input}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter your name"
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveName}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            This app helps you quickly contact emergency services and your
            emergency contacts.
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
        trackColor={{ false: "#767577", true: "#e74c3c" }}
        thumbColor="#f4f3f4"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#e74c3c",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#e74c3c",
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
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  versionText: {
    fontSize: 14,
    color: "#888",
  },
});
