import axios from "axios";
import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useState, useCallback } from "react";

// Create Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor for auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Transform function type
type Transformer<T> = (data: any) => T;

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const get = useCallback(
    async <T = any,>(
      url: string,
      config: AxiosRequestConfig = {},
      transform?: Transformer<T>
    ): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        const response: AxiosResponse = await apiClient.get(url, config);

        //(`Response status: ${response.data.status}`);

        if (response.data.status.toString() === "failed") {
          setError(new Error("Failed to fetch data"));
        }

        return transform ? transform(response.data) : response.data;
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const post = useCallback(
    async <T = any,>(
      url: string,
      data: any = {},
      config: AxiosRequestConfig = {},
      transform?: Transformer<T>
    ): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        const isFormData =
          typeof FormData !== "undefined" && data instanceof FormData;

        const headers = {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...(config.headers || {}),
        };

        const response: AxiosResponse = await apiClient.post(url, data, {
          ...config,
          headers,
        });

        return transform ? transform(response.data) : response.data;
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const put = useCallback(
    async <T = any,>(
      url: string,
      data: any = {},
      config: AxiosRequestConfig = {},
      transform?: Transformer<T>
    ): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const isFormData =
          typeof FormData !== "undefined" && data instanceof FormData;

        const headers = {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...(config.headers || {}),
        };

        const response: AxiosResponse = await apiClient.put(url, data, {
          ...config,
          headers,
        });

        const resData = transform ? transform(response.data) : response.data;

        // 🔴 THIS IS THE FIX
        if (resData?.status === "failed") {
          throw new Error(resData.message || "API returned status: failed");
        }

        return resData;
      } catch (err: any) {
        setError(err);
        throw err; // will now get caught in the calling function
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { get, post, put, loading, error };
};

export default useApi;
