import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTheme, Theme } from "../utils/theme";

interface ThemeState {
  isDarkMode: boolean;
  theme: Theme;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
  isThemeLoaded: boolean; // Add this to track loading state
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      theme: getTheme(false),
      isThemeLoaded: false, // Initialize as not loaded
      toggleTheme: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
          theme: getTheme(!state.isDarkMode),
        })),
      setDarkMode: (isDark: boolean) =>
        set({
          isDarkMode: isDark,
          theme: getTheme(isDark),
        }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // When storage is rehydrated, mark theme as loaded
        if (state) {
          state.isThemeLoaded = true;
        }
      },
    }
  )
);
