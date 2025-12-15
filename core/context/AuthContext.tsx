"use client";
import { createBaseRequest } from "@/core/model/createBaseRequest";
import { redirect, useRouter } from "next/navigation";

import React from "react";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "sonner";

export type UserRole = "Farmer" | "Insurance Company";

// Define the shape of the authentication state
interface AuthState {
  phoneNumber: string | null;
  userId: UserRole | null;
  accessToken: string | null;
  login: (userId: UserRole, phoneNumber: string, accessToken: string) => void;
  logout: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

// Create an empty default context
const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [userId, setUserId] = useState<UserRole | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // // Load auth data from localStorage (or cookies) on initial render
  useEffect(() => {
    const hydrateAuth = () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        const storedPhoneNumber = localStorage.getItem("phoneNumber");
        const storedAccessToken = localStorage.getItem("accessToken");

        if (storedUserId && storedPhoneNumber && storedAccessToken) {
          if (
            storedUserId === "Farmer" ||
            storedUserId === "Insurance Company"
          ) {
            setUserId(storedUserId as UserRole);
            setPhoneNumber(storedPhoneNumber);
            setAccessToken(storedAccessToken);
          } else {
            setUserId(null);
          }
        }
      } catch (e) {
        setUserId(null);
      } finally {
        setIsLoading(false);
      }
    };

    hydrateAuth();
  }, []);

  // Function to log in the user
  const login = async (
    userId: UserRole,
    phoneNumber: string,
    accessToken: string
  ) => {
    setIsLoading(true);
    try {
      const baseRequest = await createBaseRequest();
      localStorage.setItem("userId", userId);
      localStorage.setItem("phoneNumber", phoneNumber);
      localStorage.setItem("accessToken", accessToken);

      setUserId(userId);
      setPhoneNumber(phoneNumber);
      setAccessToken(accessToken);
      // if (baseRequest.location) {
      //   console.log(
      //     baseRequest.location.latitude,
      //     baseRequest.location.longitude
      //   );
      // } else {
      //   console.warn("baseRequest.location is null");
      // }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error(
        "Failed to make API call. Please enable location permissions and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to log out the user
  const logout = () => {
    setUserId(null);
    setPhoneNumber(null);
    setAccessToken(null);

    localStorage.removeItem("userId");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("accessToken");
    setIsLoading(true);

    // alert("Log out successful")
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        phoneNumber,
        userId,
        accessToken,
        login,
        logout,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth state
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
