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
  Menu,
  X,
} from "lucide-react";
import { PiFlowerTulipFill } from "react-icons/pi";
import { BsClipboardCheck, BsClipboardCheckFill } from "react-icons/bs";
import { GiCow } from "react-icons/gi";
import { MdOutlineManageAccounts, MdOutlineSettings } from "react-icons/md";
import { useAuth } from "@/core/context/AuthContext";
import { RiSurveyLine } from "react-icons/ri";
import LocalizationToggle from "@/components/utils/LocalizationToggle";

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
    title: "Surveys",
    url: "/survey",
    icon: RiSurveyLine,
    activeIcon: RiSurveyLine,
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

const MAX_VISIBLE_ITEMS = 8;

const MobileNav = () => {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMore, setOpenMore] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { logout,userId } = useAuth();

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
  };

  const handleToggle = (url: string) => {
    setOpenMenu((prev) => (prev === url ? null : url));
    setOpenMore(false);
  };

  const visibleItems = allNavItems.slice(0, MAX_VISIBLE_ITEMS);
  const moreItems = allNavItems.slice(MAX_VISIBLE_ITEMS);

  const handleCloseMenus = () => {
    setOpenMenu(null);
    setOpenMore(false);
    setDrawerOpen(false);
  };

  if (pathname === "/login") return null;

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="lg:hidden fixed top-3 right-3 z-[100] bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200/50 hover:bg-white/95 transition-all duration-200"
        onClick={() => setDrawerOpen(!drawerOpen)}
      >
        {drawerOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] transition-opacity duration-300"
          onClick={handleCloseMenus}
        />
      )}

      {/* Drawer */}
      <nav
        className={`fixed top-0 right-0 h-full w-72 bg-white/95 backdrop-blur-md shadow-2xl z-[99] transform transition-transform duration-500 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          {/* <button
            className="p-2 rounded-md hover:bg-gray-100"
            onClick={handleCloseMenus}
          >
            <X className="w-6 h-6" />
          </button> */}
        </div>

        {/* Drawer Content */}
        <div className=" h-[90vh]">
          {/* Visible Items */}
          {visibleItems.map((item) => {
              if (item.title === "Reports" && userId == "Farmer" ) {
                return null;
              }
              if (userId === "Insurance Company") {
                // Show ONLY Reports
                if (item.title !== "Reports") return null;
              }
            const isActive =
              pathname === item.url ||
              (item.children &&
                item.children.some((child) => pathname.startsWith(child.url)));

            const Icon =
              isActive && item.activeIcon ? item.activeIcon : item.icon;

            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = openMenu === item.url;

            return (
              <div key={item.url} className="">
                {hasChildren ? (
                  <button
                    onClick={() => handleToggle(item.url)}
                    className={`flex items-center justify-between w-full px-4 py-3 text-sm ${
                      isActive ? "text-blue-700 font-semibold" : "text-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.url}
                    onClick={handleCloseMenus}
                    className={`flex items-center justify-between w-full px-4 py-3 text-sm ${
                      isActive ? "text-blue-700 font-semibold" : "text-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                  </Link>
                )}

                {/* Child Dropdown */}
                {hasChildren && isExpanded && (
                  <div className="pl-10 pr-4 pb-2 space-y-1">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.url;
                      return (
                        <Link
                          key={child.url}
                          href={child.url}
                          onClick={handleCloseMenus}
                          className={`flex items-center gap-2 px-2 py-2 text-sm rounded-md ${
                            isChildActive
                              ? "bg-blue-950 text-blue-200 font-bold"
                              : "text-gray-600 hover:bg-gray-100"
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

          <div className="flex flex-col justify-between">
            <div className="">
              {/* More Section */}
              <div className="border-b">
                <button
                  onClick={() => {
                    setOpenMore((prev) => !prev);
                    setOpenMenu(null);
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <MoreHorizontal className="w-5 h-5" />
                    <span>More</span>
                  </div>
                  {openMore ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {openMore && (
                  <div className="pl-10 pr-4 pb-2 space-y-1">
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
                          className={`flex items-center gap-2 px-2 py-2 text-sm rounded-md ${
                            isActive
                              ? "bg-blue-950 text-blue-200 font-bold"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {item.icon && <item.icon className="w-5 h-5" />}
                          {item.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Language Toggle */}
              <div className="px-4 py-4 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Language</span>
                  <LocalizationToggle />
                </div>
              </div>
            </div>

            <div className="mt-20">
              {/* Logout Button */}
              <div className="px-4 py-4 h-full">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full cursor-pointer font-medium text-red-500 hover:text-white bg-white border border-red-600 hover:bg-red-600 rounded-sm transition duration-200 shadow-sm text-sm py-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
