"use client";

import React, { useState } from "react";
import { Landmark, Shield, ShieldAlert, BookOpen, Key, DollarSign, Scale, Globe, CheckCircle } from "lucide-react";

export default function EducationalCards() {
  const [activeTab, setActiveTab] = useState<"formal-informal" | "rail-control" | "why-matters">("formal-informal");

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
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Formal Channels (Regulated Rails)
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Licensed commercial banks, money transfer operators (Wise, Western Union, MoneyGram), and licensed fintechs. These routes operate under central bank supervision, AML/CFT compliance audits, and clear state jurisdictions.
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-1 text-[10.5px]">
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
                  <span className="font-semibold text-slate-300 block mb-0.5">Average Cost</span>
                  <span className="text-slate-400">3.5% - 7% (includes fixed fees and FX spreads)</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
                  <span className="font-semibold text-slate-300 block mb-0.5">Settlement Speed</span>
                  <span className="text-slate-400">Instant (Fintechs) to 3-5 days (Banks / SWIFT)</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 col-span-2">
                  <span className="font-semibold text-slate-300 block mb-0.5">Regulatory Considerations</span>
                  <span className="text-slate-400">Strict KYC, compliance verification, and transaction tracking to prevent financial crimes.</span>
                </div>
              </div>

              <div className="text-[10px] text-emerald-500/90 font-medium flex items-center gap-1.5 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Provides full legal protection, deposit insurance, and transaction receipts.</span>
              </div>
            </div>

            {/* Informal channels */}
            <div className="bg-slate-900/40 p-4.5 rounded-xl border border-slate-800/60 space-y-3.5">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                Informal Channels (Hawala / Unlicensed Networks)
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Trust-based systems operating outside formal bank supervision. Money does not physically cross borders. Instead, Hawaladars net off balances locally through international trade invoices, gold trading, and familial ties.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1 text-[10.5px]">
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
                  <span className="font-semibold text-slate-300 block mb-0.5">Average Cost</span>
                  <span className="text-slate-400">1% - 2.5% (determined by cash pool availability)</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
                  <span className="font-semibold text-slate-300 block mb-0.5">Settlement Speed</span>
                  <span className="text-slate-400">Near Instant (mediated by phone/message networks)</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 col-span-2">
                  <span className="font-semibold text-slate-300 block mb-0.5">Operational Risk</span>
                  <span className="text-slate-400">High counterparty risk (the agent may abscond). High risk of severe criminal penalties.</span>
                </div>
              </div>

              <div className="text-[10px] text-amber-500/90 font-medium flex items-center gap-1.5 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Purely trust-based. Operates in regions with blocked banking channels or high inflation.</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Who Controls the Rail */}
        {activeTab === "rail-control" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in text-[10.5px]">
            {/* Card 1: Central Banks */}
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-2">
                  <Landmark className="w-4 h-4 text-emerald-400" />
                  Central Banks
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Operate large-value national payment rails (e.g. Fedwire, TARGET2) and set exchange rate rules.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-850/80 space-y-1">
                <div><span className="font-semibold text-slate-300">Rules Set:</span> Monetary policy, reserve rules</div>
                <div><span className="font-semibold text-slate-300">Fee Share:</span> Zero (operates infrastructure)</div>
              </div>
            </div>

            {/* Card 2: Commercial Banks */}
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-2">
                  <Key className="w-4 h-4 text-blue-400" />
                  Commercial Banks
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Hold international liquidity in correspondent accounts and handle the legacy SWIFT messaging routing.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-850/80 space-y-1">
                <div><span className="font-semibold text-slate-300">Approvals:</span> KYC/AML compliance reviews</div>
                <div><span className="font-semibold text-slate-300">Fee Share:</span> High fixed wire routing charges</div>
              </div>
            </div>

            {/* Card 3: Payment Networks */}
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  Payment Networks
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Card schemes (Visa, MasterCard) clearing payments on proprietary international rails.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-850/80 space-y-1">
                <div><span className="font-semibold text-slate-300">Rules Set:</span> Interoperability specs</div>
                <div><span className="font-semibold text-slate-300">Fee Share:</span> Interchange and clearing fees</div>
              </div>
            </div>

            {/* Card 4: Fintechs & Crypto */}
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-2">
                  <DollarSign className="w-4 h-4 text-amber-500" />
                  Fintech & Stablecoins
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Provide aggregations or block public ledger protocols directly, bypassing legacy banking loops.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-850/80 space-y-1">
                <div><span className="font-semibold text-slate-300">Who moves:</span> Smart contracts / peer-to-peer</div>
                <div><span className="font-semibold text-slate-300">Fee Share:</span> Network gas fee, low spread</div>
              </div>
            </div>
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
              <div className="bg-slate-950/40 p-3.5 rounded-lg border border-slate-850 space-y-1">
                <span className="font-bold text-emerald-400 text-xs block mb-1">Financial Inclusion</span>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Remittances are often the first step into formal banking for rural families, enabling saving accounts and micro-insurance.
                </p>
              </div>
              <div className="bg-slate-950/40 p-3.5 rounded-lg border border-slate-850 space-y-1">
                <span className="font-bold text-blue-400 text-xs block mb-1">Macroeconomic Stability</span>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  In many developing nations, remittance flows exceed foreign direct investment (FDI) and official development aid combined, contributing up to 30% of national GDP.
                </p>
              </div>
              <div className="bg-slate-950/40 p-3.5 rounded-lg border border-slate-850 space-y-1">
                <span className="font-bold text-amber-500 text-xs block mb-1">Family Support</span>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Direct cross-border support goes straight to households, financing daily necessities, education, healthcare, and micro-businesses.
                </p>
              </div>
            </div>
            
            <div className="text-[10px] text-slate-400 border-t border-slate-850 pt-3 leading-relaxed">
              <strong>UN Sustainable Development Goal (SDG) 10.c:</strong> Aims to reduce the transaction costs of migrant remittances to less than 3% and eliminate corridor costs higher than 5% by 2030. High fee margins directly extract capital from vulnerable families.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
