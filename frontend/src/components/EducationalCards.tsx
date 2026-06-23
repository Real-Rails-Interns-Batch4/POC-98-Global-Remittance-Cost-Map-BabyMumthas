"use client";

import React, { useState } from "react";
import { Landmark, Shield, ShieldAlert, BookOpen, Key, DollarSign, Scale, Globe, CheckCircle } from "lucide-react";
import educationalContent from "@/data/educational-content.json";

// Icon mapping to resolve JSON icon names to React components
const ICON_MAP: Record<string, React.ReactNode> = {
  CheckCircle: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4 text-amber-500" />,
  Landmark: <Landmark className="w-4 h-4 text-emerald-400" />,
  Key: <Key className="w-4 h-4 text-blue-400" />,
  Globe: <Globe className="w-4 h-4 text-purple-400" />,
  DollarSign: <DollarSign className="w-4 h-4 text-amber-500" />,
};

export default function EducationalCards() {
  const [activeTab, setActiveTab] = useState<"formal-informal" | "rail-control" | "why-matters">("formal-informal");

  const { formalChannels, informalChannels, railControlCards, whyMattersCards, sdgNote } = educationalContent;

  return (
    <div className="bg-slate-950/65 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Navigation tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Remittance Knowledge Library
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Learn how the global payment infrastructure works and who controls the underlying rails.
          </p>
        </div>

        <div className="flex bg-slate-900/60 border border-slate-850 p-0.5 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab("formal-informal")}
            className={`px-3 py-1.5 rounded-md transition-all ${activeTab === "formal-informal" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}
          >
            Formal vs Informal
          </button>
          <button
            onClick={() => setActiveTab("rail-control")}
            className={`px-3 py-1.5 rounded-md transition-all ${activeTab === "rail-control" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}
          >
            Who Controls The Rail?
          </button>
          <button
            onClick={() => setActiveTab("why-matters")}
            className={`px-3 py-1.5 rounded-md transition-all ${activeTab === "why-matters" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}
          >
            Why This Matters
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 min-h-[360px]">
        {/* Tab 1: Formal vs Informal */}
        {activeTab === "formal-informal" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in">
            {/* Formal channels */}
            <div className="bg-slate-900/40 p-4.5 rounded-xl border border-slate-800/60 space-y-3.5">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                {ICON_MAP[formalChannels.iconName]}
                {formalChannels.title}
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {formalChannels.description}
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-1 text-[10.5px]">
                {formalChannels.stats.map((stat, idx) => (
                  <div key={idx} className={`bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 ${stat.fullWidth ? "col-span-2" : ""}`}>
                    <span className="font-semibold text-slate-300 block mb-0.5">{stat.label}</span>
                    <span className="text-slate-400">{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-emerald-500/90 font-medium flex items-center gap-1.5 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{formalChannels.footerNote}</span>
              </div>
            </div>

            {/* Informal channels */}
            <div className="bg-slate-900/40 p-4.5 rounded-xl border border-slate-800/60 space-y-3.5">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                {ICON_MAP[informalChannels.iconName]}
                {informalChannels.title}
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {informalChannels.description}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1 text-[10.5px]">
                {informalChannels.stats.map((stat, idx) => (
                  <div key={idx} className={`bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 ${stat.fullWidth ? "col-span-2" : ""}`}>
                    <span className="font-semibold text-slate-300 block mb-0.5">{stat.label}</span>
                    <span className="text-slate-400">{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-amber-500/90 font-medium flex items-center gap-1.5 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{informalChannels.footerNote}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Who Controls the Rail */}
        {activeTab === "rail-control" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in text-[10.5px]">
            {railControlCards.map((card, idx) => (
              <div key={idx} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-2">
                    <span className={card.iconColor}>{ICON_MAP[card.iconName]}</span>
                    {card.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-850/80 space-y-1">
                  {card.details.map((detail, dIdx) => (
                    <div key={dIdx}><span className="font-semibold text-slate-300">{detail.label}:</span> {detail.value}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Why This Matters */}
        {activeTab === "why-matters" && (
          <div className="bg-slate-900/20 p-4.5 rounded-xl border border-slate-800/60 space-y-4 animate-fade-in">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              The Economic Impact of Remittances
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10.5px]">
              {whyMattersCards.map((card, idx) => (
                <div key={idx} className="bg-slate-950/40 p-3.5 rounded-lg border border-slate-850 space-y-1">
                  <span className={`font-bold ${card.titleColor} text-xs block mb-1`}>{card.title}</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    {card.content}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="text-[10px] text-slate-400 border-t border-slate-850 pt-3 leading-relaxed">
              <strong>{sdgNote}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
