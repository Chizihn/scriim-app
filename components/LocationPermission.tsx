import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";
import * as Location from "expo-location";
import { useLocationStore } from "../store/useLocationStore";
import { useThemeStore } from "@/store/useThemeStore";

const LocationPermission: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { location, requestLocation } = useLocationStore();
  const { theme, isDarkMode } = useThemeStore();

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== "granted" && !location) {
      setModalVisible(true);
    }
  };

  const handleRequestPermission = async () => {
    await requestLocation();
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: theme.card }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            Location Access Required
          </Text>
          <Text
            style={[styles.modalText, { color: isDarkMode ? "#aaa" : "#555" }]}
          >
            This app needs access to your location to send accurate emergency
            alerts. Your location will only be shared when you press the panic
            button.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonCancel,
                { borderColor: theme.border },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.buttonCancelText, { color: theme.text }]}>
                Later
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonAllow]}
              onPress={handleRequestPermission}
            >
              <Text style={styles.buttonAllowText}>Allow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    minWidth: "45%",
    alignItems: "center",
  },
  buttonAllow: {
    backgroundColor: "#4CAF50",
  },
  buttonCancel: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  buttonAllowText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonCancelText: {
    fontSize: 16,
  },
});

export default LocationPermission;
