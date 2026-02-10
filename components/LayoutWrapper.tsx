"use client";

import { usePathname } from "next/navigation";
import TopNav from "@/components/TopNav";
import DesktopSideBar from "@/components/Navigation/DesktopSideBar";
import MobileNav from "@/components/Navigation/MobileNav";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <>
      {/* Top Nav - hidden on login */}
      {!isLogin && (
        <div className="relative">
          <TopNav />
        </div>
      )}

      <div className="flex min-h-screen">
        {!isLogin && (
          <aside className="hidden lg:block">
            <DesktopSideBar />
          </aside>
        )}

        {/* remove margin if login */}
        <main className={`flex-1 ${isLogin ? "mt-0" : "md:mt-5"}`}>
          {children}
        </main>

        {!isLogin && (
          <div className="block lg:hidden">
            <MobileNav />
          </div>
        )}
      </div>
    </>
  );
}
