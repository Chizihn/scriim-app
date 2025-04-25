import { Contact } from "@/store/useContactStore";
import axios from "axios";

const PROD_API = "https://scriim-api.vercel.app/api";
const DEV_API = "http://192.168.14.2:5000/api";

// Replace with your actual backend URL
const API_URL = process.env.NODE_ENV !== "development" ? PROD_API : DEV_API;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface PanicPayload {
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  contacts?: Partial<Contact[]>;
  authorityType?: "police" | "hospital" | "fire";
}

export interface PanicResponse {
  success: boolean;
  message?: string;
  data?: any;
  count?: number;
}

export const sendPanic = async (
  payload: PanicPayload
): Promise<PanicResponse> => {
  try {
    const response = await api.post(`${API_URL}/panic`, payload);
    return response.data;
  } catch (error) {
    console.error("Error sending panic:", error);
    throw error;
  }
};

export const getAllPanics = async () => {
  try {
    const response = await api.get("/api/panic");
    return response.data;
  } catch (error) {
    console.error("Error fetching panics:", error);
    throw error;
  }
};

export default api;
