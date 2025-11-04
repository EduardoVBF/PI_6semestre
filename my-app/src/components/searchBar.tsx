"use client";
import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar...",
  width = "w-full",
}: SearchBarProps) {
  return (
    <div className={`relative my-4 ${width}`}>
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-gray-700 w-full rounded-md pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-purple transition-all"
      />
    </div>
  );
}
