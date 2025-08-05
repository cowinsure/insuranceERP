// utils/createBaseRequest.ts

import { toast } from "sonner";
import { BaseRequestModel } from "@/core/model/BaseRequestModel";

// Assume you get user info from somewhere (like localStorage, context, etc.)

export const createBaseRequest = async (): Promise<BaseRequestModel> => {
  const userId = localStorage.getItem("userId") || "";
  const phoneNumber = localStorage.getItem("phoneNumber") || "";

  const location = await getCurrentLocation();

  return {
    userId,
    phoneNumber,
    location,
  };
};

const checkLocationPermission = async (): Promise<PermissionState> => {
  if (!navigator.permissions) {
    return "prompt"; // fallback
  }

  try {
    const result = await navigator.permissions.query({ name: "geolocation" });
    return result.state; // 'granted' | 'denied' | 'prompt'
  } catch (error) {
    console.error("Permissions API not supported or failed:", error);
    return "prompt";
  }
};

const getCurrentLocation = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  const permissionState = await checkLocationPermission();

  if (permissionState === "denied") {
    toast.error(
      "You have blocked location access. Please enable it from browser settings to continue."
    );
    return null;
  }

  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return resolve(null);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location permission is required to continue.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          toast.error("Location information is unavailable.");
        } else if (error.code === error.TIMEOUT) {
          toast.error("Location request timed out.");
        } else {
          toast.error("An unknown error occurred while fetching location.");
        }
        resolve(null);
      }
    );
  });
};
