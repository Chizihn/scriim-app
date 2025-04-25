import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useThemeStore } from "@/store/useThemeStore";

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
  const { theme } = useThemeStore();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: theme.primary },
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
    width: 200,
    height: 200,
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
