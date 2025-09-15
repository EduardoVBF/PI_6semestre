"use client";

export function About() {
  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary-purple mb-8">
            Sobre o FROTINIX
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            O FROTINIX é uma solução completa para gestão de frotas, desenvolvida para atender às necessidades específicas de empresas que buscam eficiência e controle em suas operações de transporte.
          </p>
          <p className="text-lg text-gray-300 mb-6">
            Nossa plataforma oferece ferramentas avançadas para monitoramento de consumo, gestão de abastecimentos, controle de manutenções e análise de desempenho, tudo em uma interface intuitiva e fácil de usar.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-primary-purple mb-2">Missão</h3>
              <p className="text-gray-300">Otimizar a gestão de frotas com tecnologia inovadora e sustentável</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-primary-purple mb-2">Visão</h3>
              <p className="text-gray-300">Ser referência em soluções tecnológicas para gestão de frotas</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-primary-purple mb-2">Valores</h3>
              <p className="text-gray-300">Inovação, Sustentabilidade, Eficiência e Compromisso</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
