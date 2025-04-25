import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import { useContactsStore } from "@/store/useContactStore";
import { Contact } from "@/store/useContactStore";
import { useThemeStore } from "@/store/useThemeStore";

export default function ContactsScreen() {
  const { contacts, removeContact } = useContactsStore();
  const { theme, isDarkMode } = useThemeStore();

  const handleDeleteContact = (id: string, name: string) => {
    Alert.alert("Delete Contact", `Are you sure you want to delete ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          removeContact(id);
          Alert.alert(
            "Success",
            `${name} has been removed from your contacts.`
          );
        },
        style: "destructive",
      },
    ]);
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <View style={[styles.contactItem, { backgroundColor: theme.card }]}>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: theme.text }]}>
          {item.name}
        </Text>
        <Text
          style={[styles.contactPhone, { color: isDarkMode ? "#aaa" : "#666" }]}
        >
          {item.phoneNumber}
        </Text>
        <Text
          style={[styles.contactEmail, { color: isDarkMode ? "#999" : "#888" }]}
        >
          {item.email}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteContact(item.id as string, item.name)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <View
        style={[styles.header, { backgroundColor: theme.headerBackground }]}
      >
        <Text style={[styles.title, { color: theme.headerText }]}>
          Emergency Contacts
        </Text>
        <Text style={[styles.subtitle, { color: theme.headerText }]}>
          Manage your emergency contacts
        </Text>
      </View>

      {contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No emergency contacts yet.
          </Text>
          <Text
            style={[
              styles.emptySubText,
              { color: isDarkMode ? "#aaa" : "#666" },
            ]}
          >
            Add contacts who should be notified in case of emergency.
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id as string}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Link
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        href="/contacts/add"
        asChild
      >
        <TouchableOpacity>
          <Text style={styles.addButtonText}>+ Add New Contact</Text>
        </TouchableOpacity>
      </Link>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    textAlign: "center",
  },
  listContainer: {
    padding: 20,
  },
  contactItem: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "space-between",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  contactPhone: {
    fontSize: 16,
    marginBottom: 3,
  },
  contactEmail: {
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 5,
    padding: 8,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    borderRadius: 10,
    padding: 15,
    margin: 20,
    alignItems: "center",
    elevation: 3, // Add elevation for Android
    shadowColor: "#000", // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
