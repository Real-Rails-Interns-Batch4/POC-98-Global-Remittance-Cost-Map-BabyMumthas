"use client";

import React from "react";
import { DashboardSummary } from "@/types";
import { Globe2, Percent, TrendingDown, TrendingUp, Compass, Clock } from "lucide-react";

interface DashboardHeroProps {
  summary: DashboardSummary;
}

export default function DashboardHero({ summary }: DashboardHeroProps) {
  const cards = [
    {
      title: "Total Corridors",
      value: summary.total_corridors,
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
      desc: "Monitored cross-border payment routes",
      colorClass: "from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-400",
    },
    {
      title: "Countries Covered",
      value: summary.countries_covered,
      icon: <Globe2 className="w-5 h-5 text-blue-400" />,
      desc: "Unique nation-state jurisdictions",
      colorClass: "from-blue-500/10 to-indigo-500/5 border-blue-500/20 text-blue-400",
    },
    {
      title: "Average Transfer Cost",
      value: `${summary.average_cost_percent}%`,
      icon: <Percent className="w-5 h-5 text-emerald-400" />,
      desc: "Average cost of sending $500",
      colorClass: "from-emerald-500/10 to-green-500/5 border-emerald-500/20 text-emerald-400",
    },
    {
      title: "Average Settlement",
      value: `${summary.average_speed_hours} hrs`,
      icon: <Clock className="w-5 h-5 text-blue-400" />,
      desc: "Average transaction delivery speed",
      colorClass: "from-blue-500/10 to-sky-500/5 border-blue-500/20 text-blue-400",
    },
    {
      title: "Most Affordable Route",
      value: summary.most_affordable_corridor || "N/A",
      icon: <TrendingDown className="w-5 h-5 text-emerald-400" />,
      desc: "Lowest average markup corridor",
      colorClass: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
    },
    {
      title: "Highest Cost Route",
      value: summary.highest_cost_corridor || "N/A",
      icon: <TrendingUp className="w-5 h-5 text-red-500" />,
      desc: "Highest fee + exchange markup route",
      colorClass: "from-red-500/10 to-pink-500/5 border-red-500/20 text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-slate-950/65 border ${card.colorClass} rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.02] hover:border-slate-700/50 transition-all duration-300 shadow-lg`}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-semibold">
              {card.title}
            </span>
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shadow-inner">
              {card.icon}
            </div>
          </div>
          <div>
            <span className="text-lg md:text-xl font-black text-slate-100 font-mono tracking-tight block">
              {card.value}
            </span>
            <span className="text-[9.5px] text-slate-400 block mt-1 leading-snug">
              {card.desc}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
