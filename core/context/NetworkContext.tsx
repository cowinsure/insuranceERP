"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type NetworkStatus = "online" | "offline" | "slow";

interface NetworkContextType {
  status: NetworkStatus;
  isOnline: boolean;
}

const NetworkContext = createContext<NetworkContextType | null>(null);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<NetworkStatus>("online");

  const checkConnection = () => {
    if (!navigator.onLine) {
      setStatus("offline");
      return;
    }

    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (connection) {
      const { effectiveType, downlink } = connection;

      // You can tweak these thresholds
      if (
        effectiveType === "2g" ||
        effectiveType === "slow-2g" ||
        downlink < 1
      ) {
        setStatus("slow");
      } else {
        setStatus("online");
      }
    } else {
      setStatus("online"); // fallback
    }
  };

  useEffect(() => {
    checkConnection();

    window.addEventListener("online", checkConnection);
    window.addEventListener("offline", checkConnection);

    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    connection?.addEventListener("change", checkConnection);

    return () => {
      window.removeEventListener("online", checkConnection);
      window.removeEventListener("offline", checkConnection);
      connection?.removeEventListener("change", checkConnection);
    };
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        status,
        isOnline: status !== "offline",
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within NetworkProvider");
  }
  return context;
};
