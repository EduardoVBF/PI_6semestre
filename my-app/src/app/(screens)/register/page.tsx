"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    // TODO: Implement registration logic here
    console.log("Form data:", formData);
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary-purple via-fuchsia-800 to-indigo-900 justify-center items-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden p-8 space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-4xl font-extrabold text-primary-purple">
            FROTINIX
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Crie sua conta para começar
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nome"
              required
              className="w-full h-12 text-lg px-4 border border-gray-300 rounded-lg placeholder:text-gray-500"
            />
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Sobrenome"
              required
              className="w-full h-12 text-lg px-4 border border-gray-300 rounded-lg placeholder:text-gray-500"
            />
          </div>

          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail"
            required
            className="w-full h-12 text-lg px-4 border border-gray-300 rounded-lg placeholder:text-gray-500"
          />

          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Telefone"
            required
            className="w-full h-12 text-lg px-4 border border-gray-300 rounded-lg placeholder:text-gray-500"
          />

          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Senha"
            required
            className="w-full h-12 text-lg px-4 border border-gray-300 rounded-lg placeholder:text-gray-500"
          />

          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmar Senha"
            required
            className="w-full h-12 text-lg px-4 border border-gray-300 rounded-lg placeholder:text-gray-500"
          />
          <p className="text-gray-500 text-xs">
            Ao criar uma conta, você precisará da aprovação do administrador
            para acessar o sistema.
          </p>

          <Button
            type="submit"
            className="w-full h-12 text-lg bg-primary-purple hover:bg-fuchsia-800 transition-colors duration-200 text-white rounded-lg font-semibold cursor-pointer"
          >
            Criar Conta
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-500">Já tem uma conta?</p>
          <Link
            href="/login"
            className="text-primary-purple font-medium hover:underline"
          >
            Entre aqui
          </Link>
        </div>
      </div>
    </div>
  );
}
