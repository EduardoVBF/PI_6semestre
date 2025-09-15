"use client";
import Image from "next/image";
import { FaTruck, FaChartLine, FaUsersCog } from "react-icons/fa";

export function Features() {
  const features = [
    {
      icon: <FaTruck className="w-12 h-12" />,
      title: "Gestão de Frotas",
      description: "Controle completo sobre sua frota com monitoramento em tempo real e relatórios detalhados."
    },
    {
      icon: <FaChartLine className="w-12 h-12" />,
      title: "Análise de Consumo",
      description: "Acompanhe e otimize o consumo de combustível com análises precisas e insights valiosos."
    },
    {
      icon: <FaUsersCog className="w-12 h-12" />,
      title: "Gestão de Equipe",
      description: "Gerencie motoristas e usuários com facilidade, mantendo o controle total das operações."
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-primary-purple mb-16">
          Recursos Principais
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-xl text-white text-center hover:bg-gray-700 hover:transform hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4 text-primary-purple">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
