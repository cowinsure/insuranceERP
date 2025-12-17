import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import "animate.css";
import { AuthProvider } from "@/core/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { LocalizationProvider } from "@/core/context/LocalizationContext";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Insurance ERP",
  description: "",
  generator: "",
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
      <body
        className={`${urbanist.className} bg-gradient-to-br from-sky-50 via-blue-200 to-blue-50 relative`}
      >
        <LocalizationProvider>
          <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster />
          </AuthProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
