"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary-purple to-fuchsia-800 mt-auto">
      <div className="mx-auto px-8 py-4">
        <div className="text-end">
          <p className="text-white text-xs">
            Projeto Interdisciplinar do 6º Semestre
          </p>
          <p className="text-white text-xs">
            FATEC - Franca | Desenvolvimento de Software Multiplataforma
          </p>
          <p className="text-white text-xs">
            Desenvolvido por Bruno Algarte, Cristian Nascimento, Eduardo Vilas Boas e Rafael Verissimo
          </p>
        </div>
      </div>
    </footer>
  );
}