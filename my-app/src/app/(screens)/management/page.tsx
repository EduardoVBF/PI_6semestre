"use client";
import MaintenanceManagement from "@/components/management/maintenance";
import { FaTruck, FaUsers, FaGasPump, FaTools } from "react-icons/fa";
import VehiclesManagement from "@/components/management/vehicles";
import UsersManagement from "@/components/management/users";
import FuelManagement from "@/components/management/fuel";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Loader from "@/components/loader";
import React from "react";

export default function Management() {
  // Contadores para os cards
  const [activeTab, setActiveTab] = React.useState("vehicles");
  const totalFuelings = 250; // Exemplo de dado fixo
  const router = useRouter();

  const tabs = [
    { id: "vehicles", label: "Veículos", icon: FaTruck },
    { id: "users", label: "Usuários", icon: FaUsers },
    { id: "fuel", label: "Abastecimentos", icon: FaGasPump },
    { id: "maintenance", label: "Manutenções", icon: FaTools },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow py-4 px-8 space-y-4">
        <h1 className="text-3xl font-bold text-primary-purple">
          Gerenciamento
        </h1>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-700">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "border-primary-purple text-primary-purple"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* GERENCIAMENTO DE VEÍCULOS */}
        {activeTab === "vehicles" && <VehiclesManagement />}

        {/* GERENCIAMENTO DE USUÁRIOS */}
        {activeTab === "users" && <UsersManagement />}

        {/* GERENCIAMENTO DE ABASTECIMENTOS */}
        {activeTab === "fuel" && <FuelManagement />}

        {/* GERENCIAMENTO DE MANUTENÇÕES */}
        {activeTab === "maintenance" && <MaintenanceManagement />}
      </main>
      <Footer />
    </div>
  );
}
