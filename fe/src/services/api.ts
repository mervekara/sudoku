import axios, { type AxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add API key to every request
axiosInstance.interceptors.request.use((config) => {
  if (!config.params) config.params = {};
  return config;
});

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "API Error occurred");
  }
  console.error("Unexpected Error:", error);
  throw new Error("Unexpected error occurred");
}

export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const post = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await axiosInstance.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const put = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await axiosInstance.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
