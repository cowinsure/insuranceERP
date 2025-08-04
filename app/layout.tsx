import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Urbanist } from "next/font/google";
import "./globals.css";
import DesktopSideBar from "@/components/Navigation/DesktopSideBar";
import MobileNav from "@/components/Navigation/MobileNav";
import "animate.css";

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

export const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-urbanist",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body
        className={`${urbanist.className} bg-gradient-to-br from-lime-50 via-green-100 to-amber-50


`}
      >
        <div className="flex min-h-screen">
          <aside className="hidden lg:block">
            <DesktopSideBar />
          </aside>
          <main className="flex-1">{children}</main>

          {/* Mobile nav at bottom */}
          <div className="block lg:hidden">
            <MobileNav />
          </div>
        </div>
      </body>
    </html>
  );
}
