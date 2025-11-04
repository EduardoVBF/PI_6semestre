"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end mt-6 gap-3 select-none">
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className={`flex items-center gap-1 p-2 rounded-full text-sm font-medium transition-all duration-200 ${
          page === 1
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gray-700 text-gray-200 hover:bg-primary-purple hover:text-white"
        }`}
      >
        <ChevronLeft size={18} />
        {/* Anterior */}
      </button>

      <div className="text-sm text-gray-300 font-semibold">
        <span className="text-primary-purple">{page}</span>
        {" de "}
        <span>{totalPages}</span>
      </div>

      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className={`flex items-center gap-1 p-2 rounded-full text-sm font-medium transition-all duration-200 ${
          page === totalPages
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gray-700 text-gray-200 hover:bg-primary-purple hover:text-white"
        }`}
      >
        {/* Próxima */}
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
