import AddVehicleModalWrapper from "@/components/AddVehicleModalWrapper";
import AddUserModalWrapper from "@/components/AddUserModalWrapper";
import AddFuelSupplyModalWrapper from "@/components/AddFuelSupplyModalWrapper";
import EditFuelSupplyModalWrapper from "@/components/EditFuelSupplyModalWrapper";
import AddMaintenanceModalWrapper from "@/components/AddMaintenanceModalWrapper";
import EditMaintenanceModalWrapper from "@/components/EditMaintenanceModalWrapper";
import EditUserModalWrapper from "@/components/EditUserModalWrapper";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FROTINIX",
  description: "Controle sua frota",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900`}
      >
        {children}
        {/* wrapper client que usa Zustand */}
        <AddVehicleModalWrapper />
        <AddUserModalWrapper />
        <AddFuelSupplyModalWrapper />
        <EditFuelSupplyModalWrapper />
        <AddMaintenanceModalWrapper />
        <EditMaintenanceModalWrapper />
        <EditUserModalWrapper />
      </body>
    </html>
  );
}
