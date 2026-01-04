import { Platform } from "react-native";

const BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:3000"
    : "http://192.168.0.2:3000";

export const getApiUrl = (endpoint: string) => {
  return `${BASE_URL}${endpoint}`;
};

export const getBaseUrl = () => {
  return BASE_URL;
};

export const getDebugInfo = () => {
  return {
    platform: Platform.OS,
    baseUrl: BASE_URL,
    timestamp: new Date().toISOString(),
  };
};

