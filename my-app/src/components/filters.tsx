"use client";
import React from "react";

interface FilterPillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const FilterPill = ({ label, selected, onClick }: FilterPillProps) => (
  <span
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors duration-200 ${
      selected
        ? "bg-primary-purple text-white"
        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
    }`}
  >
    {label}
  </span>
);

interface FiltersProps {
  statusOptions: string[];
  typeOptions: { label: string; value: string }[];
  selectedStatus: string | "";
  selectedType: string | "";
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
}

export default function Filters({
  statusOptions,
  typeOptions,
  selectedStatus,
  selectedType,
  onStatusChange,
  onTypeChange,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-8 bg-gray-800 my-1">
      {/* Status Filter */}
      <div className="flex flex-col col-span-1 lg:col-span-2">
        <label className="text-sm font-semibold mb-1 text-gray-400">
          Status
        </label>
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 text-xs capitalize">
          {statusOptions.map((s) => (
            <FilterPill
              key={s}
              label={s}
              selected={selectedStatus === s}
              onClick={() => onStatusChange(selectedStatus === s ? "" : s)}
            />
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className="flex flex-col col-span-1 lg:col-span-2">
        <label className="text-sm font-semibold mb-1 text-gray-400">
          Tipo de Usuário
        </label>
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 text-xs capitalize">
          {typeOptions.map((t) => (
            <FilterPill
              key={t.value}
              label={t.label}
              selected={selectedType === t.value}
              onClick={() => onTypeChange(selectedType === t.value ? "" : t.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
