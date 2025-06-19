import { API_BASE_URL } from "@env";
import axios from "axios";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export async function getUserExpenses(userId: string) {
  try {
    const response = await apiClient.get(`/transactions/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user expenses:", error);
    throw error;
  }
}
