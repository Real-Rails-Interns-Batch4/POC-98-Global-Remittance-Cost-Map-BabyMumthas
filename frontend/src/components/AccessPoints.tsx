"use client";

import React from "react";
import { Corridor } from "@/types";
import { ShieldCheck, Landmark, Wallet, DollarSign, Globe, Layers, Users } from "lucide-react";
import channelDetailsData from "@/data/channel-details.json";

// Icon mapping to resolve JSON icon names to React components
const ICON_MAP: Record<string, React.ReactNode> = {
  DollarSign: <DollarSign className="w-4 h-4" />,
  Wallet: <Wallet className="w-4 h-4" />,
  Landmark: <Landmark className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
};

interface AccessPointsProps {
  selectedCorridor: Corridor | null;
  allCorridors: Corridor[];
}

export default function AccessPoints({ selectedCorridor, allCorridors }: AccessPointsProps) {
  // Get provider lists with their accessibility scores
  const getProviderAccess = () => {
    let providers: { name: string; score: number }[] = [];

    if (selectedCorridor) {
      providers = selectedCorridor.providers.map((p) => ({
        name: p.name,
        score: p.accessibility_score,
      }));
    } else {
      // Calculate global averages
      const sums: { [key: string]: { total_score: number; count: number } } = {};
      allCorridors.forEach((c) => {
        c.providers.forEach((p) => {
          if (!sums[p.name]) sums[p.name] = { total_score: 0, count: 0 };
          sums[p.name].total_score += p.accessibility_score;
          sums[p.name].count += 1;
        });
      });
      providers = Object.keys(sums).map((name) => ({
        name,
        score: Math.round(sums[name].total_score / sums[name].count),
      }));
    }

    return providers.sort((a, b) => b.score - a.score);
  };

  const providers = getProviderAccess();

  // Access channels loaded from JSON data file
  const channelDetails = channelDetailsData.map((ch) => ({
    name: ch.name,
    icon: <span className={ch.iconColor}>{ICON_MAP[ch.iconName] || <Globe className="w-4 h-4" />}</span>,
    desc: ch.description,
    score: ch.score,
  }));

  return (
    <div className="bg-slate-950/65 border border-slate-800/80 p-5 rounded-2xl flex flex-col h-full shadow-xl">
      <div className="border-b border-slate-800/60 pb-3 mb-4">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-emerald-400" />
          Access & Reach Scorecard
        </h3>
        <p className="text-[11px] text-slate-400 mt-1">
          {selectedCorridor
            ? `Accessibility channels for ${selectedCorridor.origin_country} → ${selectedCorridor.destination_country}`
            : "Global average access capabilities"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
        {/* Left Side: Provider Accessibility Scores */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            Provider Reach Score
          </h4>
          <div className="space-y-3">
            {providers.map((p) => {
              // Color based on accessibility score
              let progressColor = "bg-emerald-500";
              if (p.score < 60) progressColor = "bg-amber-500";
              if (p.score < 50) progressColor = "bg-red-500";

              return (
                <div key={p.name} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-300">
                    <span>{p.name}</span>
                    <span>{p.score}% index</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-850">
                    <div
                      className={`h-full ${progressColor} transition-all duration-500`}
                      style={{ width: `${p.score}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Channel Availability & Characteristics */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Infrastructure Reach
          </h4>
          <div className="space-y-3">
            {channelDetails.map((ch) => (
              <div key={ch.name} className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  {ch.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-200">{ch.name}</span>
                    <span className="text-[10px] text-slate-400">Coverage: {ch.score}%</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-normal mt-0.5">{ch.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
