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
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { PiFlowerTulipFill } from "react-icons/pi";
import { BsClipboardCheck, BsClipboardCheckFill } from "react-icons/bs";
import { GiCow } from "react-icons/gi";
import { MdOutlineManageAccounts, MdOutlineSettings } from "react-icons/md";
import { useAuth } from "@/core/context/AuthContext";

const allNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Asset",
    url: "/asset_management",
    icon: BsClipboardCheck,
    activeIcon: BsClipboardCheckFill,
    children: [
      {
        title: "Crop",
        url: "/asset_management/crop",
        icon: <PiFlowerTulipFill size={18} />,
      },
      {
        title: "Livestock",
        url: "/asset_management/livestock",
        icon: <GiCow size={20} />,
      },
    ],
  },
  {
    title: "Farmers",
    url: "/farmers",
    icon: Users,
  },
  {
    title: "Lands",
    url: "/land",
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
    title: "Applications",
    url: "/applications",
    icon: Send,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "User Management",
    url: "/user_management",
    icon: MdOutlineManageAccounts,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: MdOutlineSettings,
  },
];

// Display only these many items directly
const MAX_VISIBLE_ITEMS = 5;

const MobileNav = () => {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMore, setOpenMore] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleToggle = (url: string) => {
    setOpenMenu((prev) => (prev === url ? null : url));
    setOpenMore(false); // close "more" if something else opened
  };

  const visibleItems = allNavItems.slice(0, MAX_VISIBLE_ITEMS);
  const moreItems = allNavItems.slice(MAX_VISIBLE_ITEMS);

  const handleCloseMenus = () => {
    setOpenMenu(null);
    setOpenMore(false);
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t z-50 shadow-lg lg:hidden">
      <div className="flex justify-around items-center py-2 px-1 relative">
        {visibleItems.map((item) => {
          const isActive =
            pathname === item.url ||
            (item.children &&
              item.children.some((child) => pathname.startsWith(child.url)));
          const Icon =
            isActive && item.activeIcon ? item.activeIcon : item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = openMenu === item.url;

          return (
            <div key={item.url} className="relative flex flex-col items-center">
              <button
                onClick={() =>
                  hasChildren ? handleToggle(item.url) : handleCloseMenus()
                }
                className={`flex flex-col items-center justify-center text-xs transition-all duration-200 ${
                  isActive ? "text-blue-700 font-semibold" : "text-gray-500"
                }`}
              >
                <div
                  className={`flex flex-col items-center justify-center p-2 rounded-md ${
                    isActive ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mb-1 transition-transform duration-200 ${
                      isActive ? "scale-110" : "scale-100"
                    }`}
                  />
                  <span className="text-[11px]">{item.title}</span>
                  {/* {hasChildren &&
                    (isExpanded ? (
                      <ChevronDown size={16} className="mt-0.5" />
                    ) : (
                      <ChevronUp size={16} className="mt-0.5" />
                    ))} */}
                </div>
              </button>

              {/* Click-through for simple links */}
              {!hasChildren && (
                <Link
                  href={item.url}
                  className="absolute inset-0 z-10"
                  aria-label={item.title}
                  onClick={handleCloseMenus}
                />
              )}

              {/* Child Dropdown */}
              {hasChildren && isExpanded && (
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-md min-w-[160px] animate-slide-up">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.url;
                    return (
                      <Link
                        key={child.url}
                        href={child.url}
                        onClick={handleCloseMenus}
                        className={`flex items-center gap-2 px-4 py-2 text-sm ${
                          isChildActive
                            ? "bg-blue-950 text-blue-200 font-bold"
                            : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                        }`}
                      >
                        {child.icon}
                        {child.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* More (...) Menu */}
        <div className="relative flex flex-col items-center">
          <button
            onClick={() => {
              setOpenMore((prev) => !prev);
              setOpenMenu(null);
            }}
            className="flex flex-col items-center justify-center text-xs text-gray-500 hover:text-blue-600"
          >
            <div className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-100">
              <MoreHorizontal className="w-5 h-5 mb-1" />
              <span className="text-[11px]">More</span>
            </div>
          </button>

          {openMore && (
            <div className="absolute bottom-14 right-16 translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-md min-w-[180px] animate-slide-up max-h-[250px] overflow-y-auto space-y-0.5">
              {moreItems.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.children &&
                    item.children.some((child) =>
                      pathname.startsWith(child.url)
                    ));
                return (
                  <Link
                    key={item.url}
                    href={item.url}
                    onClick={handleCloseMenus}
                    className={`flex items-center gap-2 px-4 py-2 text-sm ${
                      isActive
                        ? "bg-blue-950 text-blue-200 font-bold"
                        : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                    }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    {item.title}
                  </Link>
                );
              })}

              <div className="group px-4 py-2">
                <button
                  onClick={handleLogout}
                  className={`flex items-center justify-center gap-2 w-full cursor-pointer font-medium text-red-500 hover:text-white bg-white border border-red-600 hover:bg-red-600 rounded-sm transition duration-200 shadow-sm text-sm py-1`}
                >
                  <LogOut className="w-5 h-5" />
                  <span
                    className={`transition-all duration-200 whitespace-nowrap`}
                  >
                    Logout
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default MobileNav;
