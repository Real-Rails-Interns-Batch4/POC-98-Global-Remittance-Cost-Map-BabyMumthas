"use client";

import React, { useState, useEffect } from "react";
import { Corridor, DashboardSummary } from "@/types";
import { fetchCorridors, fetchSummary } from "@/lib/api";
import DashboardHero from "@/components/DashboardHero";
import MapWrapper from "@/components/MapWrapper";
import FeeCompare from "@/components/FeeCompare";
import SpeedLadder from "@/components/SpeedLadder";
import AccessPoints from "@/components/AccessPoints";
import CorridorTable from "@/components/CorridorTable";
import EducationalCards from "@/components/EducationalCards";
import DownloadCenter from "@/components/DownloadCenter";
import { Loader2, ServerCrash, RefreshCw, Layers, ShieldCheck, MapPin } from "lucide-react";

export default function Home() {
  const [corridors, setCorridors] = useState<Corridor[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setError(null);
      const [corridorsData, summaryData] = await Promise.all([
        fetchCorridors(),
        fetchSummary(),
      ]);
      setCorridors(corridorsData);
      setSummary(summaryData);
    } catch (err: any) {
      console.error("Dashboard data load failure:", err);
      setError(
        "Could not establish connection to the FastAPI intelligence service on http://localhost:8000. Please ensure the backend server is running."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-slate-200">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <div className="text-center">
          <h2 className="text-sm font-bold tracking-wider uppercase">Loading Intelligence Portal</h2>
          <p className="text-[11px] text-slate-400 mt-1">Ingesting remittance records from the ETL node...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-200">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/20 p-6 rounded-2xl shadow-2xl space-y-4 text-center">
          <ServerCrash className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-100">Service Disconnected</h2>
          <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] text-left space-y-2">
            <span className="font-bold text-slate-300 block mb-1">To start the backend service:</span>
            <code className="block text-emerald-400 bg-slate-900 p-2 rounded font-mono">
              cd backend<br />
              .venv\\Scripts\\activate<br />
              python run.py
            </code>
          </div>
          <button
            onClick={handleRefresh}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500 selection:text-slate-950 font-sans pb-16">
      {/* Header Banner */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-[1000] px-4 md:px-8 py-3.5 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/10">
            R
          </div>
          <div>
            <h1 className="text-xs font-black tracking-widest uppercase text-slate-100 flex items-center gap-1.5">
              Global Remittance Cost Map
              <span className="bg-slate-900 border border-slate-800 text-[8px] px-1.5 py-0.5 rounded text-slate-400 font-normal">
                POC-98
              </span>
            </h1>
            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Real Rails Intelligence Library
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 text-[10px]">
          <div className="hidden sm:flex items-center gap-4 text-slate-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ETL: Active
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Rail Category: Hybrid
            </span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-3 py-1.5 rounded border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Section 1: Dashboard Hero KPIs */}
        {summary && <DashboardHero summary={summary} />}

        {/* Section 2: Map & Active Corridor comparison side by side */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <MapWrapper
              corridors={corridors}
              selectedCorridor={selectedCorridor}
              onSelectCorridor={setSelectedCorridor}
            />
          </div>
          <div>
            <FeeCompare selectedCorridor={selectedCorridor} allCorridors={corridors} />
          </div>
        </div>

        {/* Section 3: Speed Ladder & Access points */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpeedLadder selectedCorridor={selectedCorridor} allCorridors={corridors} />
          <AccessPoints selectedCorridor={selectedCorridor} allCorridors={corridors} />
        </div>

        {/* Section 4: Full-width Corridor Explorer Table */}
        <CorridorTable
          corridors={corridors}
          selectedCorridor={selectedCorridor}
          onSelectCorridor={setSelectedCorridor}
        />

        {/* Section 5: Educational Panels */}
        <EducationalCards />

        {/* Section 6: Ingestion Metadata & Downloads */}
        <DownloadCenter />
      </main>

      {/* Footer disclaimer */}
      <footer className="text-center text-[10px] text-slate-500 mt-10 px-6 font-semibold uppercase tracking-widest leading-relaxed">
        Real Rails Intelligence Library © 2026. All rights reserved.<br />
        This application uses realistically modeled synthetic reference data.
      </footer>
    </div>
  );
}
