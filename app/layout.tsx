import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { DashboardLayout } from "@/components/DashboardLayout";
import "./globals.css";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "YouTube Network Dashboard",
    template: "%s | YouTube Network Dashboard",
  },
  description: "Monitor channel performance, latest uploads and network growth.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plex.variable}>
      <body className="font-sans">
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
