import { Contact } from "@/store/useContactStore";
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useThemeStore } from "@/store/useThemeStore";

interface ContactItemProps {
  contact: Contact;
  onDelete: (id: string) => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, onDelete }) => {
  const { theme, isDarkMode } = useThemeStore();

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: theme.text }]}>{contact.name}</Text>
        <Text style={[styles.phone, { color: isDarkMode ? "#aaa" : "#666" }]}>
          {contact.phoneNumber}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(contact.id as string)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#FF5252",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ContactItem;
