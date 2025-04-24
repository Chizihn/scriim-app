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

export default function ContactsScreen() {
  const { contacts, removeContact } = useContactsStore();

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
    <View style={styles.contactItem}>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
        <Text style={styles.contactEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteContact(item.id, item.name)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>Emergency Contacts</Text>
        <Text style={styles.subtitle}>Manage your emergency contacts</Text>
      </View>

      {contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No emergency contacts yet.</Text>
          <Text style={styles.emptySubText}>
            Add contacts who should be notified in case of emergency.
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Link href="/contacts/add" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add New Contact</Text>
        </TouchableOpacity>
      </Link>
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
    color: "#666",
  },
  listContainer: {
    padding: 20,
  },
  contactItem: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
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
    color: "#666",
    marginBottom: 3,
  },
  contactEmail: {
    fontSize: 14,
    color: "#888",
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
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    padding: 15,
    margin: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
