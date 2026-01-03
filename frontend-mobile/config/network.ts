import { Platform } from "react-native";
import Constants from "expo-constants";

function getHost() {
  const debuggerHost = Constants.expoConfig?.hostUri;

  if (debuggerHost) {
    return debuggerHost.split(":").shift();
  }

  // fallback
  return "localhost";
}

const HOST = getHost();

const BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:3000"
    : "http://${HOST}:3000";

export const getApiUrl = (endpoint: string) => {
  return `${BASE_URL}${endpoint}`;
};

export const getBaseUrl = () => BASE_URL;

export const getDebugInfo = () => {
  return {
    platform: Platform.OS,
    baseUrl: BASE_URL,
    timestamp: new Date().toISOString(),
  };
};