"use client";
import React from "react";
import EditMaintenanceModalWrapper from "@/components/EditMaintenanceModalWrapper";
import EditFuelSupplyModalWrapper from "@/components/EditFuelSupplyModalWrapper";
import AddMaintenanceModalWrapper from "@/components/AddMaintenanceModalWrapper";
import AddFuelSupplyModalWrapper from "@/components/AddFuelSupplyModalWrapper";
import EditVehicleModalWrapper from "@/components/EditVehicleModalWrapper";
import AddVehicleModalWrapper from "@/components/AddVehicleModalWrapper";
import EditUserModalWrapper from "@/components/EditUserModalWrapper";
import AddUserModalWrapper from "@/components/AddUserModalWrapper";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
  fontClass?: string;
};

export default function RootClient({ children, fontClass }: Props) {
  return (
    <div className={fontClass}>
      <SessionProvider>
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
      </SessionProvider>
    </div>
  );
}
