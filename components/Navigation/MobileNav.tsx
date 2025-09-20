"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiFlowerTulipFill } from "react-icons/pi";

import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  Send,
  Bell,
} from "lucide-react";

const navItems = [
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
      title: "Crops",
      url: "/crop",
      icon: PiFlowerTulipFill,
     
    },
  {
    title: "Products",
    url: "/products",
    icon: FileText,
  },
  {
    title: "Claims",
    url: "/claims",
    icon: ClipboardList,
  },
  {
    title: "Apps",
    url: "/applications",
    icon: Send,
  },
  // {
  //   title: "Alerts",
  //   url: "/notifications",
  //   icon: Bell,
  // },
];

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t z-50 shadow-md">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.url;
          const Icon = item.icon;

          return (
            <Link key={item.url} href={item.url} className="flex flex-col items-center text-xs group transition-all">
              <div
                className={`flex flex-col items-center justify-center px-3 py-1 rounded-md transition-all duration-200 ${
                  isActive ? "text-green-600" : "text-gray-500"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mb-1 transition-transform duration-200 ${
                    isActive ? "scale-110" : "scale-100 group-hover:scale-105"
                  }`}
                />
                <span
                  className={`text-[11px] font-medium transition-opacity duration-200 ${
                    isActive ? "opacity-100" : "opacity-80"
                  }`}
                >
                  {item.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
