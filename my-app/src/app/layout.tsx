import EditMaintenanceModalWrapper from "@/components/EditMaintenanceModalWrapper";
import EditFuelSupplyModalWrapper from "@/components/EditFuelSupplyModalWrapper";
import AddMaintenanceModalWrapper from "@/components/AddMaintenanceModalWrapper";
import AddFuelSupplyModalWrapper from "@/components/AddFuelSupplyModalWrapper";
import EditVehicleModalWrapper from "@/components/EditVehicleModalWrapper";
import AddVehicleModalWrapper from "@/components/AddVehicleModalWrapper";
import EditUserModalWrapper from "@/components/EditUserModalWrapper";
import AddUserModalWrapper from "@/components/AddUserModalWrapper";
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
        <EditVehicleModalWrapper />
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
