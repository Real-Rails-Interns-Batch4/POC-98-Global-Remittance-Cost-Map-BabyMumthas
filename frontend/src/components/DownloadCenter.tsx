"use client";

import React from "react";
import { Download, CheckCircle2, ShieldCheck, Database, RefreshCw, FileJson, FileSpreadsheet } from "lucide-react";
import { CSV_DOWNLOAD_URL, JSON_DOWNLOAD_URL } from "@/lib/api";

export default function DownloadCenter() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 bg-slate-950/65 border border-slate-800/80 p-5 rounded-2xl shadow-xl">
      {/* Left side: Download Center */}
      <div className="space-y-3.5">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-400" />
            Download Intelligence Center
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Export structured cross-border datasets for custom analysis and modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
          {/* CSV Download Card */}
          <a
            href={CSV_DOWNLOAD_URL}
            className="flex flex-col justify-between bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 p-3.5 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-2">
              <FileSpreadsheet className="w-6 h-6 text-emerald-400 group-hover:scale-105 transition-transform" />
              <span className="text-[9px] font-semibold text-slate-500 uppercase font-mono bg-slate-950 px-1 py-0.5 rounded border border-slate-850">
                CSV
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-200 block text-xs">Corridor Flat Sheet</span>
              <p className="text-[9.5px] text-slate-400 leading-snug mt-1">
                De-normalized rows mapping providers, fee percentages, and FX spreads.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-3 pt-2 border-t border-slate-850/80">
              <Download className="w-3.5 h-3.5" />
              Download Dataset
            </div>
          </a>

          {/* JSON Download Card */}
          <a
            href={JSON_DOWNLOAD_URL}
            className="flex flex-col justify-between bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 p-3.5 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-2">
              <FileJson className="w-6 h-6 text-blue-400 group-hover:scale-105 transition-transform" />
              <span className="text-[9px] font-semibold text-slate-500 uppercase font-mono bg-slate-950 px-1 py-0.5 rounded border border-slate-850">
                JSON
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-200 block text-xs">Structured Schema</span>
              <p className="text-[9.5px] text-slate-400 leading-snug mt-1">
                Hierarchical JSON payload detailing geo-coordinates and nested providers.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-blue-400 font-semibold mt-3 pt-2 border-t border-slate-850/80">
              <Download className="w-3.5 h-3.5" />
              Download Schema
            </div>
          </a>
        </div>
      </div>

      {/* Right side: Source Quality Panel */}
      <div className="space-y-3.5 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Source Quality & Methodology
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Data specifications, freshness, and ingestion quality indices.
          </p>
        </div>

        <div className="bg-slate-900/30 p-3.5 rounded-xl border border-slate-800/60 text-[10.5px] space-y-2 font-medium">
          <div className="flex justify-between border-b border-slate-850/60 pb-1.5">
            <span className="text-slate-400">Primary Reference Sources:</span>
            <span className="text-slate-200 text-right">World Bank RPW / ECB Data Portal</span>
          </div>
          <div className="flex justify-between border-b border-slate-850/60 pb-1.5">
            <span className="text-slate-400">Data Coverage:</span>
            <span className="text-slate-200 text-right">35 global corridors, 25 distinct countries</span>
          </div>
          <div className="flex justify-between border-b border-slate-850/60 pb-1.5">
            <span className="text-slate-400">Refresh Cycle & Date:</span>
            <span className="text-slate-200 flex items-center gap-1 text-right">
              <RefreshCw className="w-3 h-3 text-slate-400 animate-spin-slow" />
              2026-06-21 (Static Reference)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Dataset Status:</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold uppercase text-[10px] font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Synthetic Label
            </span>
          </div>
        </div>

        {/* Transparency note */}
        <div className="text-[9.5px] text-slate-500 bg-slate-900/20 p-2.5 rounded-lg border border-slate-850 leading-relaxed font-medium">
          <strong>Transparency Notice:</strong> All data displayed on this portal is high-fidelity synthetic reference data modeled on real average costs. Ingestion adapters for real-time World Bank API inputs are stubbed in `/backend/app/adapters`. Do not use this data for live remittance executions.
        </div>
      </div>
    </div>
  );
}
