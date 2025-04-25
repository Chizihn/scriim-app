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
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <View
        style={[styles.header, { backgroundColor: theme.headerBackground }]}
      >
        <Text style={[styles.title, { color: theme.headerText }]}>
          Settings
        </Text>
        <Text style={[styles.subtitle, { color: theme.headerText }]}>
          Manage your personal information
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Appearance
          </Text>
          <View
            style={[styles.inputContainer, { backgroundColor: theme.card }]}
          >
            <View style={styles.themeToggleContainer}>
              <Text style={[styles.label, { color: theme.text }]}>
                Dark Mode
              </Text>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "#767577", true: theme.primary }}
                thumbColor="#f4f3f4"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Personal Information
          </Text>

          <View
            style={[styles.inputContainer, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.label, { color: theme.text }]}>
              Your Name:
            </Text>
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
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            About
          </Text>
          <View
            style={[styles.inputContainer, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.aboutText, { color: theme.text }]}>
              This app helps you quickly contact emergency services and your
              emergency contacts.
            </Text>
            <Text
              style={[
                styles.versionText,
                { color: isDarkMode ? "#888" : "#888" },
              ]}
            >
              Version 1.0.0
            </Text>
          </View>
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
    borderRadius: 10,
    padding: 15,
  },
  themeToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  versionText: {
    fontSize: 14,
  },
});
