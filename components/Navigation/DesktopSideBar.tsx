"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdOutlineSpaceDashboard,
  MdSpaceDashboard,
  MdOutlineGroups,
  MdGroups,
  MdOutlineArticle,
  MdArticle,
  MdOutlineChecklist,
  MdChecklist,
  MdOutlineSend,
  MdSend,
  MdOutlineNotifications,
  MdNotifications,
  MdOutlineManageAccounts,
  MdManageAccounts,
  MdOutlineSettings,
  MdSettings,
  // MdOutlineNotifications,
  // MdNotifications,
} from "react-icons/md";
import { FaLockOpen, FaLock } from "react-icons/fa";
import { LogOut } from "lucide-react";
import { useAuth } from "@/core/context/AuthContext";

// Menu configuration
const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: MdOutlineSpaceDashboard,
    activeIcon: MdSpaceDashboard,
  },
  {
    title: "Farmers",
    url: "/farmers",
    icon: MdOutlineGroups,
    activeIcon: MdGroups,
  },
  {
    title: "Policies",
    url: "/policies",
    icon: MdOutlineArticle,
    activeIcon: MdArticle,
  },
  {
    title: "Claims",
    url: "/claims",
    icon: MdOutlineChecklist,
    activeIcon: MdChecklist,
  },
  {
    title: "Applications",
    url: "/applications",
    icon: MdOutlineSend,
    activeIcon: MdSend,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: MdOutlineNotifications,
    activeIcon: MdNotifications,
  },
  {
    title: "User Management",
    url: "/user_management",
    icon: MdOutlineManageAccounts,
    activeIcon: MdManageAccounts,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: MdOutlineSettings,
    activeIcon: MdSettings,
  },
];

const DesktopSideBar = () => {
  const pathname = usePathname();
  const [pinned, setPinned] = useState(false);
  const isLogin = pathname === "/login";
  const { logout } = useAuth();

  // Shared styles
  const sidebarBase =
    "group sticky top-5 h-[95vh] z-40 transition-all duration-300 ease-in-out drop-shadow-xl";
  const sidebarWidth = pinned ? "w-64" : "w-[75px] hover:w-64";
  const iconSize = pinned ? "w-6 h-6" : "w-6 h-6"; // Slightly larger when collapsed

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`${sidebarBase} ${sidebarWidth} ${isLogin && "hidden"}`}>
      <div className="bg-white rounded-r-lg p-4 h-full overflow-hidden transition-all duration-300 flex flex-col">
        {/* Toggle Button */}
        <div className="flex justify-end mb-4 group">
          <button
            onClick={() => setPinned((prev) => !prev)}
            className={`text-xs px-2 py-1 rounded hover:bg-gray-300 transition cursor-pointer ${
              pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            {pinned ? (
              <FaLock title="Pin menu" className="text-blue-500" />
            ) : (
              <FaLockOpen title="Unpin menu" className="text-teal-600" />
            )}
          </button>
        </div>

        {/* Nav & Logout */}
        <div className="flex flex-col justify-between h-full">
          {/* Navigation */}
          <nav className="flex flex-col gap-3">
            {mainMenuItems.map((item) => {
              const isActive = pathname === item.url;
              const IconToRender =
                isActive && item.activeIcon ? item.activeIcon : item.icon;

              return (
                <Link key={item.url} href={item.url}>
                  <div
                    className={`flex items-center w-full py-2.5 px-2 rounded-md cursor-pointer transition-all duration-200 ${
                      isActive
                        ? "bg-blue-950 text-blue-300 drop-shadow-lg font-bold"
                        : "hover:bg-gray-100 text-gray-500 hover:text-blue-600 hover:scale-105 font-medium"
                    }`}
                  >
                    <IconToRender
                      className={`${iconSize} min-w-[25px] transition-colors ${
                        isActive ? "text-blue-300" : "hover:text-blue-600 "
                      }`}
                    />
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
                        pinned
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
          {/* Logout Button */}
          <div className="group relative">
            <button
              onClick={handleLogout}
              className={`flex items-center justify-center gap-2 w-full cursor-pointer ${
                pinned ? "px-4 py-2" : "p-2"
              } font-medium text-red-500 hover:text-white bg-white border border-red-600 hover:bg-red-600 rounded-lg transition duration-200 shadow-sm`}
            >
              <LogOut className="w-5 h-5" />
              <span
                className={`transition-all duration-200 ${
                  pinned ? "opacity-100" : "hidden group-hover:block"
                } whitespace-nowrap`}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSideBar;
