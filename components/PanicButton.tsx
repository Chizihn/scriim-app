import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface PanicButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isActive?: boolean;
}

const PanicButton: React.FC<PanicButtonProps> = ({
  onPress,
  disabled = false,
  isActive = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        isActive && styles.buttonActive,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>
        {disabled ? "Location Required" : "PANIC"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#e74c3c",
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
  buttonActive: {
    backgroundColor: "#c0392b",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default PanicButton;
