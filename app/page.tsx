"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "@/core/context/AuthContext";
import { MdOutlineCancel } from "react-icons/md";

export default function Home() {
  const auth = useAuth();
  const router = useRouter();
  
  


  useEffect(() => {
    AOS.init();
    "main layout" + auth?.accessToken + localStorage.getItem("accessToken");
    

    if (auth?.accessToken || localStorage.getItem("accessToken")) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [auth, router]);
  return null;
}
