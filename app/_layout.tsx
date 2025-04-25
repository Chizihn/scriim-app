import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocationStore } from "@/store/useLocationStore";
import { useContactsStore } from "@/store/useContactStore";
import { useThemeStore } from "@/store/useThemeStore";
import { View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function Layout() {
  const { requestLocation } = useLocationStore();
  const { loadContacts } = useContactsStore();
  const { theme, isDarkMode, isThemeLoaded } = useThemeStore();

  // Load the LahoRegular font
  const [fontsLoaded] = useFonts({
    Lato: require("../assets/fonts/Lato-Regular.ttf"),
  });

  useEffect(() => {
    // Initialize app data
    requestLocation();
    loadContacts();

    // Hide splash screen when fonts and theme are loaded
    if (fontsLoaded && isThemeLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isThemeLoaded]);

  // Show loading indicator until theme and fonts are loaded
  if (!isThemeLoaded || !fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      />
    </QueryClientProvider>
  );
}
