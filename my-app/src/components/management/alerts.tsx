"use client";
import { FaExclamationTriangle, FaPencilAlt, FaCheck } from "react-icons/fa";
import Link from "next/link";
import React from "react";

export default function AlertsManagement() {
  interface Alert {
    id: number;
    usuario: string;
    placa: string;
    veiculo: string;
    mensagem: string;
    status: "concluido" | "aberto" | "cancelado";
  }

  const mockAlerts: Alert[] = [
    {
      id: 1,
      usuario: "Eduardo Freitas",
      placa: "BQI-0502",
      veiculo: "Fiat Strada",
      mensagem: "Consumo maior que o normal no último abastecimento.",
      status: "aberto",
    },
    {
      id: 2,
      usuario: "Ana Souza",
      placa: "BSR-9401",
      veiculo: "Volkswagen Gol",
      mensagem: "Abastecimento suspeito detectado.",
      status: "aberto",
    },
    {
      id: 3,
      usuario: "Carlos Lima",
      placa: "QWE-1287",
      veiculo: "Chevrolet Onix",
      mensagem: "Manutenção preventiva recomendada em breve.",
      status: "concluido",
    },
    {
      id: 4,
      usuario: "Fernanda Alves",
      placa: "XYZ-4521",
      veiculo: "Toyota Corolla",
      mensagem: "Última média de consumo abaixo do esperado.",
      status: "concluido",
    },
    {
      id: 5,
      usuario: "Marcos Pereira",
      placa: "JKT-7812",
      veiculo: "Renault Duster",
      mensagem: "Sensor de combustível apresentou leitura inconsistente.",
      status: "cancelado",
    },
  ];

  //   essa parte feita por erro de hidratação, talvez quando integrar a api nao vai precisar
  const [count, setCount] = React.useState<number | null>(null);
  const [monthCount, setMonthCount] = React.useState<number | null>(null);
  const [todayCount, setTodayCount] = React.useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aberto":
        return "bg-yellow-700 text-white";
      case "concluido":
        return "bg-green-700 text-white";
      case "cancelado":
        return "bg-red-700 text-white";
      default:
        return "bg-gray-700 text-white";
    }
  };

  React.useEffect(() => {
    setCount(Math.floor(Math.random() * 20));
    setMonthCount(Math.floor(Math.random() * 10));
    setTodayCount(Math.floor(Math.random() * 5));
  }, []);

  return (
    <div className="space-y-6 mt-6">
      {/* Cards principais */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary-purple rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaExclamationTriangle size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Alertas em aberto</p>
            <h2 className="text-4xl font-bold">
              {/* {(Math.random() * 100).toFixed(0)} */}
              {count !== null ? count : "—"}
            </h2>
          </div>
        </div>
        <div className="bg-fuchsia-800 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaExclamationTriangle size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Alertas no mês</p>
            <h2 className="text-4xl font-bold">
              {monthCount !== null ? monthCount : "—"}
            </h2>
          </div>
        </div>
        <div className="bg-indigo-900 rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <FaExclamationTriangle size={40} className="text-white opacity-75" />
          <div>
            <p className="text-base text-white/80">Alertas Hoje</p>
            <h2 className="text-4xl font-bold">
              {todayCount !== null ? todayCount : "—"}
            </h2>
          </div>
        </div>
      </section>

      <div className="bg-gray-800 rounded-xl shadow-lg p-2 md:p-6">
      <h3 className="text-2xl font-semibold mb-4 text-primary-purple m-2">
        Alertas Recentes
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-600">
            <tr>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Placa
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Veículo
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Mensagem
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="bg-gray-800 divide-y divide-gray-600">
            {mockAlerts.map((alert) => (
              <tr key={alert.id}>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {alert.usuario}
                </td>

                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  <Link href={`/vehicle/${alert.placa}`} className="hover:underline hover:text-white">
                  {alert.placa}
                  </Link>
                </td>

                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {alert.veiculo}
                </td>

                <td className="px-3 md:px-6 py-4 text-sm text-gray-300 flex items-center gap-2 min-w-[200px]">
                  {alert.mensagem}
                </td>

                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      alert.status
                    )}`}
                  >
                    {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                  </span>
                </td>

                <td className="px-3 md:px-6 py-4 text-sm space-x-2">
                  <button
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                    onClick={() => console.log("Concluir alerta:", alert)}
                  >
                    <FaCheck
                      className="text-gray-300 hover:text-green-500 transition-colors duration-200"
                      size={16}
                    />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                    onClick={() => console.log("Editar alerta:", alert)}
                  >
                    <FaPencilAlt
                      className="text-gray-300 hover:text-primary-purple transition-colors duration-200"
                      size={16}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
