import axios from "axios";
import { ConfigurationSession } from "./configuration_session";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export const serviceMap = {
  configurationSession: new ConfigurationSession(axiosInstance),
};
