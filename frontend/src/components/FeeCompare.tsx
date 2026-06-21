"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Corridor, Provider } from "@/types";
import { Info, HelpCircle } from "lucide-react";

interface FeeCompareProps {
  selectedCorridor: Corridor | null;
  allCorridors: Corridor[];
}

export default function FeeCompare({ selectedCorridor, allCorridors }: FeeCompareProps) {
  // Transfer amount for visualization
  const SEND_AMOUNT = 500;

  // Prepare data for the chart
  const getChartData = () => {
    let providers: Provider[] = [];

    if (selectedCorridor) {
      providers = selectedCorridor.providers;
    } else {
      // Calculate average provider stats across all corridors
      const providerSum: { [key: string]: { fee_percent: number; fixed_fee: number; fx_spread: number; count: number } } = {};
      
      allCorridors.forEach((c) => {
        c.providers.forEach((p) => {
          if (!providerSum[p.name]) {
            providerSum[p.name] = { fee_percent: 0, fixed_fee: 0, fx_spread: 0, count: 0 };
          }
          providerSum[p.name].fee_percent += p.fee_percent;
          providerSum[p.name].fixed_fee += p.fixed_fee;
          providerSum[p.name].fx_spread += p.fx_spread;
          providerSum[p.name].count += 1;
        });
      });

      return Object.keys(providerSum).map((name) => {
        const avg = providerSum[name];
        const fee_percent = avg.fee_percent / avg.count;
        const fixed_fee = avg.fixed_fee / avg.count;
        const fx_spread = avg.fx_spread / avg.count;

        const pFee = (fee_percent * SEND_AMOUNT) / 100;
        const fFee = fixed_fee;
        const fxMarkup = (fx_spread * SEND_AMOUNT) / 100;
        const total = pFee + fFee + fxMarkup;

        return {
          name,
          "Percentage Fee ($)": parseFloat(pFee.toFixed(2)),
          "Fixed Fee ($)": parseFloat(fFee.toFixed(2)),
          "FX Spread Markup ($)": parseFloat(fxMarkup.toFixed(2)),
          "Total Cost ($)": parseFloat(total.toFixed(2)),
          effectivePercent: ((total / SEND_AMOUNT) * 100).toFixed(2),
        };
      });
    }

    return providers.map((p) => {
      const pFee = (p.fee_percent * SEND_AMOUNT) / 100;
      const fFee = p.fixed_fee;
      const fxMarkup = (p.fx_spread * SEND_AMOUNT) / 100;
      const total = pFee + fFee + fxMarkup;

      return {
        name: p.name,
        "Percentage Fee ($)": parseFloat(pFee.toFixed(2)),
        "Fixed Fee ($)": parseFloat(fFee.toFixed(2)),
        "FX Spread Markup ($)": parseFloat(fxMarkup.toFixed(2)),
        "Total Cost ($)": parseFloat(total.toFixed(2)),
        effectivePercent: ((total / SEND_AMOUNT) * 100).toFixed(2),
      };
    });
  };

  const chartData = getChartData();
  
  // Sort data so the cheapest provider is at the top
  const sortedChartData = [...chartData].sort((a, b) => a["Total Cost ($)"] - b["Total Cost ($)"]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-xl text-slate-200">
          <div className="text-xs font-bold text-slate-100 mb-1.5">{data.name}</div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between gap-4 text-emerald-400">
              <span>Percentage Fee:</span>
              <span>${data["Percentage Fee ($)"].toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4 text-blue-400">
              <span>Fixed Fee:</span>
              <span>${data["Fixed Fee ($)"].toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4 text-amber-400">
              <span>FX Spread Markup:</span>
              <span>${data["FX Spread Markup ($)"].toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-slate-800 pt-1.5 mt-1 text-slate-100 font-semibold">
              <span>Total Cost:</span>
              <span>${data["Total Cost ($)"].toFixed(2)} ({data.effectivePercent}%)</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-950/65 border border-slate-800/80 p-5 rounded-2xl flex flex-col h-full shadow-xl">
      <div className="flex justify-between items-start mb-4 border-b border-slate-800/60 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            Fee & Exchange Rate Breakdown
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {selectedCorridor
              ? `Cost breakdown of sending $${SEND_AMOUNT} on ${selectedCorridor.origin_country} → ${selectedCorridor.destination_country}`
              : `Global average provider cost breakdown of sending $${SEND_AMOUNT}`}
          </p>
        </div>
        <div className="bg-slate-900/60 text-[10px] text-slate-300 font-semibold px-2 py-1 border border-slate-800 rounded">
          Amount: ${SEND_AMOUNT} USD
        </div>
      </div>

      <div className="flex-1 min-h-[300px] text-[11px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedChartData}
            layout="y"
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <XAxis type="number" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `$${val}`} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              fontSize={10}
              width={100}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(30, 41, 59, 0.3)" }} />
            <Legend
              wrapperStyle={{ fontSize: 10, paddingTop: 10 }}
              verticalAlign="bottom"
              align="center"
            />
            <Bar dataKey="Percentage Fee ($)" stackId="a" fill="#10b981" />
            <Bar dataKey="Fixed Fee ($)" stackId="a" fill="#3b82f6" />
            <Bar dataKey="FX Spread Markup ($)" stackId="a" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Educational Insight footer */}
      <div className="mt-4 pt-3 border-t border-slate-850 flex items-start gap-2 bg-slate-900/20 p-2.5 rounded-lg border border-slate-850">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-[10px] text-slate-400 leading-relaxed">
          <strong>Dashboard Insight:</strong> Providers hide costs in FX spread markups (the markup between interbank exchange rates and consumer rates). Bank transfers feature high fixed fees (SWIFT routing) but minimal percentage margins, while Wise and Crypto maintain near-interbank exchange rates with low fee percentages.
        </div>
      </div>
    </div>
  );
}
