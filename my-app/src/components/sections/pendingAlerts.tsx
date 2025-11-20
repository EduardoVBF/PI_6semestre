import { FaExclamationTriangle, FaChevronDown } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import React, { useState } from "react";
import Link from "next/link";
import { TAlert } from "@/types/TAlerts";
import dayjs from "dayjs";

const PendingAlerts: React.FC<{ filteredData: { alertas: TAlert[] } }> = ({ filteredData }) => {
  const [showAlerts, setShowAlerts] = useState(false);

  const notResolvedAlerts = filteredData.alertas.filter((alert) => !alert.resolved);
  // apenas os 3 primeiros alertas para exibição
  const visibleAlerts = notResolvedAlerts.slice(0, 3);

  return (
    <div className="w-full flex justify-start">
      <section className="w-fit">
        <div
          className={`bg-yellow-800/50 border border-yellow-600 text-yellow-100 rounded-xl shadow-lg transition-all duration-300 ${
            showAlerts
              ? "space-y-3 p-4"
              : "cursor-pointer hover:bg-yellow-800/70 px-4 py-2"
          }`}
          onClick={!showAlerts ? () => setShowAlerts(true) : undefined}
        >
          {/* Cabeçalho */}
          <div className="flex justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle
                size={22}
                className="text-yellow-400 animate-pulse"
              />
              <h3 className="text-lg font-bold text-yellow-300">
                Alertas {showAlerts ? "Pendentes" : ""} ({notResolvedAlerts.length})
              </h3>
            </div>
            {showAlerts ? (
              <IoCloseCircle
                size={22}
                className="text-yellow-400 cursor-pointer hover:text-yellow-300 transition"
                onClick={() => setShowAlerts(false)}
              />
            ) : (
              <FaChevronDown
                size={16}
                className="text-yellow-400 transition-transform group-hover:translate-y-1"
              />
            )}
          </div>
          {/* Lista de alertas */}
          {showAlerts && (
            <div className="animate-fadeIn">
              <ul className="divide-y divide-yellow-700 mt-3">
                {visibleAlerts.map((alert, index) => (
                  <Link
                    href="/management#alerts"
                    key={alert.id}
                    className="hover:bg-yellow-900/30 transition-colors block px-4"
                  >
                    <li
                      key={index}
                      className="py-2 text-sm flex flex-wrap items-center gap-2"
                    >
                      {/* <span className="font-semibold text-yellow-200">
                        {alert.user}
                      </span> */}
                      <span className="font-semibold text-yellow-200">
                        {dayjs(alert.created_at).format("DD/MM/YYYY HH:mm")}
                      </span>
                      <span className="text-yellow-500">|</span>
                      <span className="font-semibold">{alert.placa}</span>
                      <span className="text-yellow-500">|</span>
                      {/* <span className="font-semibold">{alert.veiculo}</span>
                      <span className="text-yellow-500">-</span> */}
                      <span>{alert.message}</span>
                    </li>
                  </Link>
                ))}
              </ul>
              {/* Rodapé */}
              <div className="mt-4 flex justify-between items-center">
                <span className="text-yellow-400 text-sm">
                  Mostrando {visibleAlerts.length} de {notResolvedAlerts.length}
                </span>
                <Link
                  href="/management#alerts"
                  className="text-yellow-300 hover:text-yellow-100 text-sm font-medium underline underline-offset-4 transition cursor-pointer"
                >
                  Ver todos
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PendingAlerts;
