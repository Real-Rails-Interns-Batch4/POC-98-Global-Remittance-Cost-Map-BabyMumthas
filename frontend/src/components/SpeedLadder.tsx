"use client";

import React from "react";
import { Corridor, Provider } from "@/types";
import { Clock, Zap, Timer, Calendar, AlertTriangle } from "lucide-react";

interface SpeedLadderProps {
  selectedCorridor: Corridor | null;
  allCorridors: Corridor[];
}

export default function SpeedLadder({ selectedCorridor, allCorridors }: SpeedLadderProps) {
  // Get provider lists with their settlement speeds
  const getProviderSpeeds = () => {
    let providers: { name: string; hours: number }[] = [];

    if (selectedCorridor) {
      providers = selectedCorridor.providers.map((p) => ({
        name: p.name,
        hours: p.settlement_time_hours,
      }));
    } else {
      // Calculate global averages
      const sums: { [key: string]: { total_hours: number; count: number } } = {};
      allCorridors.forEach((c) => {
        c.providers.forEach((p) => {
          if (!sums[p.name]) sums[p.name] = { total_hours: 0, count: 0 };
          sums[p.name].total_hours += p.settlement_time_hours;
          sums[p.name].count += 1;
        });
      });
      providers = Object.keys(sums).map((name) => ({
        name,
        hours: sums[name].total_hours / sums[name].count,
      }));
    }

    return providers;
  };

  const providers = getProviderSpeeds();

  // Speed Tiers definitions
  const SpeedTiers = [
    {
      id: "instant",
      name: "Instant",
      description: "Settles under 1 hour",
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      colorClass: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
      check: (hours: number) => hours < 1.0,
    },
    {
      id: "sameday",
      name: "Same Day",
      description: "Settles in 1 to 24 hours",
      icon: <Clock className="w-4 h-4 text-blue-400" />,
      colorClass: "border-blue-500/30 text-blue-400 bg-blue-500/5",
      check: (hours: number) => hours >= 1.0 && hours <= 24.0,
    },
    {
      id: "1day",
      name: "1 Day",
      description: "Settles in 24 to 48 hours",
      icon: <Timer className="w-4 h-4 text-amber-500" />,
      colorClass: "border-amber-500/30 text-amber-500 bg-amber-500/5",
      check: (hours: number) => hours > 24.0 && hours <= 48.0,
    },
    {
      id: "2days",
      name: "2 Days",
      description: "Settles in 48 to 72 hours",
      icon: <Calendar className="w-4 h-4 text-orange-500" />,
      colorClass: "border-orange-500/30 text-orange-500 bg-orange-500/5",
      check: (hours: number) => hours > 48.0 && hours <= 72.0,
    },
    {
      id: "3daysplus",
      name: "3+ Days",
      description: "Settles in 72+ hours (typical legacy SWIFT)",
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
      colorClass: "border-red-500/30 text-red-500 bg-red-500/5",
      check: (hours: number) => hours > 72.0,
    },
  ];

  return (
    <div className="bg-slate-950/65 border border-slate-800/80 p-5 rounded-2xl flex flex-col h-full shadow-xl">
      <div className="border-b border-slate-800/60 pb-3 mb-4">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-emerald-400" />
          Remittance Settlement Speed Ladder
        </h3>
        <p className="text-[11px] text-slate-400 mt-1">
          {selectedCorridor
            ? `Active settlement times for ${selectedCorridor.origin_country} → ${selectedCorridor.destination_country}`
            : "Global average provider settlement times"}
        </p>
      </div>

      {/* Speed Ladder Stack */}
      <div className="flex-1 space-y-3.5 relative">
        {SpeedTiers.map((tier, idx) => {
          const matchingProviders = providers.filter((p) => tier.check(p.hours));

          return (
            <div
              key={tier.id}
              className={`flex items-stretch rounded-xl border p-3 ${tier.colorClass} relative transition-all duration-300 hover:scale-[1.01]`}
            >
              {/* Connector line for vertical timeline */}
              {idx < SpeedTiers.length - 1 && (
                <div className="absolute left-[29px] top-11 bottom-[-22px] w-0.5 bg-slate-800/60 z-0"></div>
              )}

              {/* Icon Container */}
              <div className="w-9 h-9 rounded-lg bg-slate-950/80 border border-slate-800/50 flex items-center justify-center shrink-0 z-10 shadow-md">
                {tier.icon}
              </div>

              {/* Tier Information */}
              <div className="ml-3.5 flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{tier.name}</h4>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      {tier.description}
                    </span>
                  </div>
                </div>

                {/* Placed Providers */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {matchingProviders.length > 0 ? (
                    matchingProviders.map((p) => {
                      // Formatting hours nicely
                      const displayTime =
                        p.hours < 1.0
                          ? `${Math.round(p.hours * 60)} mins`
                          : p.hours >= 24
                          ? `${Math.round(p.hours / 24)} ${p.hours / 24 === 1 ? "day" : "days"}`
                          : `${p.hours.toFixed(1)} hrs`;

                      return (
                        <div
                          key={p.name}
                          className="px-2 py-1 rounded bg-slate-950/80 text-[10px] text-slate-300 border border-slate-850 shadow-inner flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span className="font-medium text-slate-200">{p.name}</span>
                          <span className="text-slate-400 text-[9px]">({displayTime})</span>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-[10px] text-slate-500 italic">No providers in this tier</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
