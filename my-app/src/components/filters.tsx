"use client";
import React from "react";

interface Option {
  label: string;
  value: string;
}

interface FilterGroup {
  key: string;
  label: string;
  options: Option[];
  selected?: string;
  onChange: (value: string) => void;
}

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
  groups: FilterGroup[];
}

export default function Filters({ groups }: FiltersProps) {
  return (
    <div className="flex flex-col gap-4 bg-gray-800 my-1 p-2">
      {groups.map((g) => (
        <div key={g.key} className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-400">
            {g.label}
          </label>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 text-xs capitalize">
            {g.options.map((opt) => (
              <FilterPill
                key={opt.value}
                label={opt.label}
                selected={g.selected === opt.value}
                onClick={() =>
                  g.onChange(g.selected === opt.value ? "" : opt.value)
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
