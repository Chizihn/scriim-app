import { create } from "zustand";
import * as Location from "expo-location";

interface LocationState {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  isLoading: boolean;
  requestLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  errorMsg: null,
  isLoading: false,
  requestLocation: async () => {
    set({ isLoading: true });
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        set({
          errorMsg: "Permission to access location was denied",
          isLoading: false,
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      set({ location, isLoading: false, errorMsg: null });
    } catch (error) {
      set({ errorMsg: "Failed to get location", isLoading: false });
    }
  },
}));
