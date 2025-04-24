import { Stack } from "expo-router";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocationStore } from "../store/useLocationStore";
import { useContactsStore } from "@/store/useContactStore";

// Create a client
const queryClient = new QueryClient();

export default function Layout() {
  const { requestLocation } = useLocationStore();
  const { loadContacts } = useContactsStore();

  useEffect(() => {
    // Initialize app data
    requestLocation();
    loadContacts();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#ffffff" },
        }}
      />
    </QueryClientProvider>
  );
}
