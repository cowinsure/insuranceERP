"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  Send,
  Bell,
} from "lucide-react";

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Farmers",
    url: "/farmers",
    icon: Users,
  },
  {
    title: "Policies",
    url: "/policies",
    icon: FileText,
  },
  {
    title: "Claims",
    url: "/claims",
    icon: ClipboardList,
  },
  {
    title: "Applications",
    url: "/applications",
    icon: Send,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
];

const DesktopSideBar = () => {
  const pathname = usePathname();
  const [pinned, setPinned] = useState(false);

  return (
    <div
      className={`group sticky top-5 h-[calc(100vh-5rem)] z-40 ${
        pinned ? "w-64" : "w-[70px] hover:w-64"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="bg-white border rounded-lg p-4 h-full overflow-hidden transition-all duration-300">
        {/* Toggle Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setPinned((prev) => !prev)}
            className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 transition"
          >
            {pinned ? "Unlock" : "Pin"}
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.url;

            return (
              <Link key={item.url} href={item.url}>
                <div
                  className={`flex items-center w-full py-3 px-2 rounded-md cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-green-600 text-white shadow-md"
                      : "hover:bg-gray-100 text-gray-700 hover:scale-105"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 min-w-[20px] transition-colors ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`ml-3 text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${
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
      </div>
    </div>
  );
};

export default DesktopSideBar;
