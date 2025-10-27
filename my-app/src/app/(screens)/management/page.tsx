"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTruck, FaUsers, FaGasPump, FaTools } from "react-icons/fa";
import Header from "@/components/header";
import Footer from "@/components/footer";

import VehiclesManagement from "@/components/management/vehicles";
import UsersManagement from "@/components/management/users";
import FuelManagement from "@/components/management/fuel";
import MaintenanceManagement from "@/components/management/maintenance";

export default function Management() {
  const [activeTab, setActiveTab] = React.useState("vehicles");

  const tabs = [
    { id: "vehicles", label: "Veículos", icon: FaTruck },
    { id: "users", label: "Usuários", icon: FaUsers },
    { id: "fuel", label: "Abastecimentos", icon: FaGasPump },
    { id: "maintenance", label: "Manutenções", icon: FaTools },
  ];

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const validTab = tabs.some((tab) => tab.id === hash);
      setActiveTab(validTab ? hash : "vehicles");
    };

    if (!window.location.hash) {
      window.history.replaceState(null, "", "#vehicles");
    }

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (window.location.hash !== `#${tabId}`) {
      window.history.pushState(null, "", `#${tabId}`);
    }
  };

  const contentAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.25 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />

      <main className="flex-grow py-6 px-8 space-y-4">
        <h1 className="text-3xl font-bold text-primary-purple">Gerenciamento</h1>

        <div className="border-b border-gray-700 relative">
          <div className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 relative">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative flex items-center gap-2 py-4 px-4 rounded-md transition-all duration-200 ${
                    isActive
                      ? "text-primary-purple"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="whitespace-nowrap">{tab.label}</span>

                  {isActive && (
                    <>
                      <motion.div
                        layoutId="tab-bg"
                        className="absolute inset-0 rounded-md bg-gradient-to-t from-primary-purple/30 via-primary-purple/15 to-transparent"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-purple rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {activeTab === "vehicles" && (
              <motion.div key="vehicles" {...contentAnimation}>
                <VehiclesManagement />
              </motion.div>
            )}
            {activeTab === "users" && (
              <motion.div key="users" {...contentAnimation}>
                <UsersManagement />
              </motion.div>
            )}
            {activeTab === "fuel" && (
              <motion.div key="fuel" {...contentAnimation}>
                <FuelManagement />
              </motion.div>
            )}
            {activeTab === "maintenance" && (
              <motion.div key="maintenance" {...contentAnimation}>
                <MaintenanceManagement />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
