import { Platform } from "react-native";

export const sendSMSDirectly = async (
  phoneNumber: string,
  message: string
): Promise<boolean> => {
  try {
    if (Platform.OS === "android") {
      // For Android, we can use Intents to send SMS without permissions
      // This is a simplified example - in a real app, you'd use a native module
      const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
      await Linking.openURL(url);
      return true;
    } else if (Platform.OS === "ios") {
      // For iOS, we can use the SMS URL scheme
      const url = `sms:${phoneNumber}&body=${encodeURIComponent(message)}`;
      await Linking.openURL(url);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error sending SMS directly:", error);
    return false;
  }
};

export const makePhoneCall = async (phoneNumber: string): Promise<boolean> => {
  try {
    const url = `tel:${phoneNumber}`;
    await Linking.openURL(url);
    return true;
  } catch (error) {
    console.error("Error making phone call:", error);
    return false;
  }
};

// Import at the top
import * as Linking from "expo-linking";
