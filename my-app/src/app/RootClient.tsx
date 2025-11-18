"use client";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { SessionProvider } from "next-auth/react";
import AuthGuard from "@/components/AuthGuard";
import React from "react";

import EditMaintenanceModalWrapper from "@/components/EditMaintenanceModalWrapper";
import EditFuelSupplyModalWrapper from "@/components/EditFuelSupplyModalWrapper";
import AddMaintenanceModalWrapper from "@/components/AddMaintenanceModalWrapper";
import AddFuelSupplyModalWrapper from "@/components/AddFuelSupplyModalWrapper";
import EditVehicleModalWrapper from "@/components/EditVehicleModalWrapper";
import AddVehicleModalWrapper from "@/components/AddVehicleModalWrapper";
import UserPhonesModalWrapper from "@/components/UserPhonesModalWrapper";
import EditUserModalWrapper from "@/components/EditUserModalWrapper";
import AddUserModalWrapper from "@/components/AddUserModalWrapper";

type Props = {
  children: React.ReactNode;
  fontClass?: string;
};

export default function RootClient({ children, fontClass }: Props) {
  return (
    <div className={fontClass}>
      <SessionProvider>
      <ReactQueryProvider>
        <AuthGuard>
          {children}
          {/* wrappers client que usam Zustand */}
          <UserPhonesModalWrapper />
          <EditVehicleModalWrapper />
          <AddVehicleModalWrapper />
          <AddUserModalWrapper />
          <AddFuelSupplyModalWrapper />
          <EditFuelSupplyModalWrapper />
          <AddMaintenanceModalWrapper />
          <EditMaintenanceModalWrapper />
          <EditUserModalWrapper />
        </AuthGuard>
      </ReactQueryProvider>
      </SessionProvider>
    </div>
  );
}
