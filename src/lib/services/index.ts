import axios, { AxiosError } from "axios";
import { ConfigurationSession } from "./configuration_session";
import { ProductSetService } from "./product_set";
import { AuthService } from "./auth";
import { capitalize } from "../utils";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const errorMessage = (error.response?.data as { error?: string })?.error || "Something went wrong";
    return Promise.reject(new Error(capitalize(errorMessage)));
  }
);

export const serviceMap = {
  configurationSession: new ConfigurationSession(axiosInstance),
  productSet: new ProductSetService(axiosInstance),
  auth: new AuthService(axiosInstance)
};
