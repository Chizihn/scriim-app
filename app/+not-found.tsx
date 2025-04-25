import { Stack } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { useThemeStore } from "@/store/useThemeStore";

export default function NotFoundScreen() {
  const { theme } = useThemeStore();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>This screen doesn't exist.</Text>
        <Text style={{ color: theme.text, marginTop: 15 }}>
          Go to home screen!
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
