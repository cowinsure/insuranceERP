"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useNetwork } from "../context/NetworkContext";

export default function NetworkListener() {
  const { status } = useNetwork();

  useEffect(() => {
    if (status === "offline") {
      toast.error("No Internet Connection", {
        description: "Please check your network connection.",
        duration: Infinity,
        id: "network-status",
      });
    }

    if (status === "slow") {
      toast.warning("Slow Internet Connection", {
        description: "Your connection is unstable or slow.",
        id: "network-status",
      });
    }

    if (status === "online") {
      toast.success("Back Online", {
        description: "Internet connection restored.",
        id: "network-status",
        duration: 3000,
      });
    }
  }, [status]);

  return null;
}
