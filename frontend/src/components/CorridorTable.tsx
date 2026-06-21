"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { Corridor } from "@/types";
import { Search, ChevronDown, ChevronUp, ArrowRight, Download, Eye, ExternalLink } from "lucide-react";
import { CSV_DOWNLOAD_URL } from "@/lib/api";

interface CorridorTableProps {
  corridors: Corridor[];
  selectedCorridor: Corridor | null;
  onSelectCorridor: (corridor: Corridor | null) => void;
}

export default function CorridorTable({
  corridors,
  selectedCorridor,
  onSelectCorridor,
}: CorridorTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [costTierFilter, setCostTierFilter] = useState("all");

  const data = useMemo(() => {
    if (costTierFilter === "all") return corridors;
    if (costTierFilter === "low") return corridors.filter((c) => c.average_cost_percent < 3.0);
    if (costTierFilter === "mid") return corridors.filter((c) => c.average_cost_percent >= 3.0 && c.average_cost_percent <= 5.0);
    return corridors.filter((c) => c.average_cost_percent > 5.0);
  }, [corridors, costTierFilter]);

  const columns = useMemo<ColumnDef<Corridor>[]>(
    () => [
      {
        id: "route",
        header: "Remittance Route",
        accessorFn: (row) => `${row.origin_country} ${row.destination_country}`,
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex items-center gap-2 font-medium text-slate-200">
              <span className="bg-slate-900 border border-slate-800 text-[10px] px-1.5 py-0.5 rounded font-mono">
                {row.origin_code}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="bg-slate-900 border border-slate-800 text-[10px] px-1.5 py-0.5 rounded font-mono">
                {row.destination_code}
              </span>
              <span className="text-[11px] ml-1 hidden sm:inline text-slate-400">
                {row.origin_country} → {row.destination_country}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "average_cost_percent",
        header: "Avg Cost",
        cell: (info) => {
          const val = info.getValue() as number;
          let color = "text-emerald-400";
          if (val >= 3.0 && val <= 5.0) color = "text-amber-500";
          if (val > 5.0) color = "text-red-500";
          return <span className={`font-bold ${color}`}>{val.toFixed(2)}%</span>;
        },
      },
      {
        accessorKey: "average_speed_hours",
        header: "Avg Settlement",
        cell: (info) => {
          const val = info.getValue() as number;
          if (val < 1.0) return <span className="text-emerald-400 font-semibold">Instant (&lt;1h)</span>;
          if (val <= 24.0) return <span className="text-blue-400">Same Day ({val.toFixed(0)}h)</span>;
          return <span className="text-slate-400">{Math.round(val / 24)} days</span>;
        },
      },
      {
        accessorKey: "risk_score",
        header: "Risk Index",
        cell: (info) => {
          const val = info.getValue() as number;
          let color = "bg-emerald-950/40 text-emerald-400 border-emerald-500/20";
          if (val >= 4.0 && val <= 7.0) color = "bg-amber-950/40 text-amber-400 border-amber-500/20";
          if (val > 7.0) color = "bg-red-950/40 text-red-400 border-red-500/20";
          return (
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono ${color}`}>
              {val.toFixed(1)}/10
            </span>
          );
        },
      },
      {
        id: "providers",
        header: "Available Providers",
        accessorFn: (row) => row.providers.map((p) => p.name).join(", "),
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex flex-wrap gap-1 max-w-[200px] sm:max-w-xs">
              {row.providers.map((p) => (
                <span
                  key={p.name}
                  className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] text-slate-300 font-medium"
                >
                  {p.name}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const row = info.row.original;
          const isSelected = selectedCorridor?.id === row.id;
          return (
            <button
              onClick={() => onSelectCorridor(isSelected ? null : row)}
              className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded border transition-colors ${
                isSelected
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
                  : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              {isSelected ? "Active" : "Inspect"}
            </button>
          );
        },
      },
    ],
    [selectedCorridor, onSelectCorridor]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  return (
    <div className="bg-slate-950/65 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Filters Header */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 border-b border-slate-800/60 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
            Corridor Explorer
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Search, sort, filter, and inspect institutional corridor analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search database..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 w-full md:w-48 placeholder-slate-500"
            />
          </div>

          {/* Cost bracket filter */}
          <select
            value={costTierFilter}
            onChange={(e) => setCostTierFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Costs</option>
            <option value="low">Cheap (&lt; 3%)</option>
            <option value="mid">Mid (3 - 5%)</option>
            <option value="high">Expensive (&gt; 5%)</option>
          </select>

          {/* Export CSV button */}
          <a
            href={CSV_DOWNLOAD_URL}
            className="flex items-center gap-1 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-semibold text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </a>
        </div>
      </div>

      {/* Responsive Table grid */}
      <div className="overflow-x-auto rounded-lg border border-slate-900">
        <table className="w-full border-collapse text-left text-[11px] text-slate-300">
          <thead className="bg-slate-900/80 border-b border-slate-850 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    onClick={h.column.getCanSort() ? h.column.getToggleSortingHandler() : undefined}
                    className={`p-3 select-none ${h.column.getCanSort() ? "cursor-pointer hover:bg-slate-850 hover:text-slate-200" : ""}`}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getCanSort() && (
                        {
                          asc: <ChevronUp className="w-3.5 h-3.5" />,
                          desc: <ChevronDown className="w-3.5 h-3.5" />,
                        }[h.column.getIsSorted() as string] ?? <span className="w-3.5 h-3.5 opacity-25">↕</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-900 bg-slate-950/20">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                const isSelected = selectedCorridor?.id === row.original.id;
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-900/40 transition-colors ${
                      isSelected ? "bg-emerald-950/10 hover:bg-emerald-950/20 border-l border-l-emerald-500" : ""
                    }`}
                  >
                    {row.getVisibleCells().map((c) => (
                      <td key={c.id} className="p-3">
                        {flexRender(c.column.columnDef.cell, c.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-slate-500 italic">
                  No corridors match search filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
        <div>
          Showing page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1} ({table.getFilteredRowModel().rows.length} total entries)
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-850 hover:text-slate-200 transition-all font-semibold"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-850 hover:text-slate-200 transition-all font-semibold"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
