"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/home");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary-purple via-fuchsia-800 to-indigo-900 justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden p-8 space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-4xl font-extrabold text-primary-purple">
            FROTINIX
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Bem-vindo! Por favor, entre na sua conta.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="E-mail"
            className="w-full h-12 text-lg px-4 border border-gray-300 rounded-lg placeholder:text-gray-500"
          />
          <Input
            type="password"
            placeholder="Senha"
            className="w-full h-12 text-lg px-4 border border-gray-300 rounded-lg placeholder:text-gray-500"
          />
        </div>

        <Button
          className="w-full h-12 text-lg bg-primary-purple hover:bg-fuchsia-800 transition-colors duration-200 text-white rounded-lg font-semibold cursor-pointer"
          onClick={handleLogin}
        >
          Entrar
        </Button>

        <div className="text-center text-sm">
          <p className="text-gray-500">Não tem uma conta?</p>
          <Link
            href="/register"
            className="text-primary-purple font-medium hover:underline"
          >
            Crie uma conta
          </Link>
        </div>
      </div>
    </div>
  );
}
