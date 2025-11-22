"use client";

import React, { useEffect, useState } from "react";

interface DateFiltersProps {
  startDate?: string; // ISO yyyy-mm-dd (valor aplicado pelo pai)
  endDate?: string; // ISO yyyy-mm-dd (valor aplicado pelo pai)
  onChange: (payload: { startDate: string; endDate: string }) => void;
  startLabel?: string;
  endLabel?: string;
  showPresets?: boolean;
  className?: string;
}

function formatDisplay(dateIso?: string) {
  if (!dateIso) return "";
  // input expected yyyy-mm-dd
  const parts = dateIso.split("-");
  if (parts.length !== 3) return dateIso;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export default function DateFilters({
  startDate = "",
  endDate = "",
  onChange,
  startLabel = "Data início",
  endLabel = "Data fim",
  showPresets = true,
  className = "",
}: DateFiltersProps) {
  // estado local para edição (inputs)
  const [start, setStart] = useState<string>(startDate);
  const [end, setEnd] = useState<string>(endDate);
  const [error, setError] = useState<string | null>(null);

  // manter inputs sincronizados quando o pai altera os valores aplicados
  useEffect(() => {
    setStart(startDate ?? "");
  }, [startDate]);

  useEffect(() => {
    setEnd(endDate ?? "");
  }, [endDate]);

  // validação visual
  useEffect(() => {
    if (start && end && start > end) {
      setError("Data de início não pode ser posterior à data fim");
    } else {
      setError(null);
    }
  }, [start, end]);

  const clear = () => {
    setStart("");
    setEnd("");
    // aplica imediatamente para refletir o estado do filtro
    onChange({ startDate: "", endDate: "" });
  };

  const apply = () => {
    if (start && end && start > end) {
      setError("Data de início não pode ser posterior à data fim");
      return;
    }

    // aplica e mantém os inputs mostrando o que foi aplicado
    onChange({ startDate: start, endDate: end });
  };

  const applyPreset = (days: number) => {
    const today = new Date();
    const startDt = new Date(today);
    startDt.setDate(startDt.getDate() - (days - 1));

    const toISO = (d: Date) => d.toISOString().slice(0, 10);
    const s = toISO(startDt);
    const e = toISO(today);

    setStart(s);
    setEnd(e);

    // aplicar imediatamente quando escolher preset
    onChange({ startDate: s, endDate: e });
  };

  const hasActiveFilter = Boolean((startDate && startDate !== "") || (endDate && endDate !== ""));

  return (
    <div className={`bg-gray-800 p-3 my-1 rounded ${className}`}>
      <div className="flex flex-col gap-3 md:gap-4">
        {/* Row: inputs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-1 flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-400">{startLabel}</label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="px-3 py-2 rounded bg-gray-700 text-sm text-gray-100 outline-none"
            />
          </div>

          <div className="md:col-span-1 flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-400">{endLabel}</label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="px-3 py-2 rounded bg-gray-700 text-sm text-gray-100 outline-none"
            />
          </div>

          {/* presets */}
          <div className="md:col-span-1 flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-400">Presets</label>
            <div className="flex gap-2 flex-wrap">
              {showPresets && (
                <>
                  <button
                    onClick={() => applyPreset(1)}
                    className="text-xs px-3 py-1 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
                  >
                    Hoje
                  </button>
                  <button
                    onClick={() => applyPreset(7)}
                    className="text-xs px-3 py-1 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
                  >
                    7 dias
                  </button>
                  <button
                    onClick={() => applyPreset(30)}
                    className="text-xs px-3 py-1 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
                  >
                    30 dias
                  </button>
                </>
              )}
            </div>
          </div>

          {/* actions */}
          <div className="md:col-span-1 flex items-center justify-end gap-2">
            <button
              onClick={clear}
              className="px-3 py-2 rounded-full text-sm font-medium bg-transparent border border-gray-700 text-gray-200 hover:bg-gray-700 min-w-[96px]"
              title="Limpar filtros"
            >
              Limpar
            </button>

            <button
              onClick={apply}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-primary-purple text-white hover:brightness-95 min-w-[96px]"
              title="Aplicar filtros"
            >
              Aplicar
            </button>
          </div>
        </div>

        {/* Active filter summary */}
        {hasActiveFilter && (
          <div className="flex items-center justify-between bg-gray-900/40 border border-gray-700 rounded px-3 py-2">
            <div className="text-sm text-gray-200">
              <span className="font-semibold">Filtrando:</span>
              {startDate ? (
                <span className="ml-2">{formatDisplay(startDate)}</span>
              ) : (
                <span className="ml-2 text-gray-400">(sem início)</span>
              )}
              <span className="mx-2">—</span>
              {endDate ? (
                <span>{formatDisplay(endDate)}</span>
              ) : (
                <span className="text-gray-400">(sem fim)</span>
              )}
            </div>

            <div>
              <button
                onClick={clear}
                className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
                title="Remover filtro de data"
              >
                Remover
              </button>
            </div>
          </div>
        )}

        {error && <div className="mt-1 text-sm text-red-400">{error}</div>}
      </div>
    </div>
  );
}
