"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary-purple via-fuchsia-800 to-indigo-900 ">
      <div className="container mx-auto px-4 py-16 text-center text-white z-5">
        <h1 className="text-6xl font-extrabold mb-6">FROTINIX</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Tecnologia avançada para gestão de frotas. Otimize suas operações,
          reduza custos e aumente a eficiência com nossa plataforma completa.
        </p>
        <Link href="/login">
          <Button className="bg-white text-primary-purple hover:bg-gray-100 text-lg px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer">
            Começar Agora
          </Button>
        </Link>
        <Image
          src="/image/Mack.webp"
          alt="Road"
          width={400}
          height={200}
          className="mx-auto mt-12"
        />
      </div>
      <Image
        src="/image/trucks.jpg"
        alt="FROTINIX"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 opacity-20"
      />
    </section>
  );
}
