"use client";
import React, { useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/core/context/AuthContext";
import LocalizationToggle from "./utils/LocalizationToggle";
import { usePathname } from "next/navigation";

const TopNav = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const isLogin = pathname === "/login";

  if (isLogin) return null;

  return (
    <nav className="absolute right-3 top-3 bg-white rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)] hidden lg:block">
      <div className="flex items-center gap-4 relative z-50 py-3 px-3">
        <LocalizationToggle />

        {/* WRAPPER THAT HANDLES HOVER */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* USER ICON */}
          <div className="w-9 h-9 bg-blue-200 rounded-full flex items-center justify-center cursor-pointer drop-shadow-2xl">
            <FaUserCircle className="w-9 h-9 text-blue-950 " />
          </div>

          {/* DROPDOWN */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="w-full text-left text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md flex items-center px-4 py-2"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
