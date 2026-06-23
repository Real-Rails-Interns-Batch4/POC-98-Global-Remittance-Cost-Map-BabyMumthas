"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Corridor, Provider } from "@/types";
import { Search, X, Landmark, Wallet, AlertTriangle, ArrowRight, Zap, Info } from "lucide-react";

// Fix Leaflet assets in Next.js by using inline custom SVG markers
const createPulseIcon = (colorClass: string) => {
  let hexColor = "#10b981"; // green
  if (colorClass === "orange") hexColor = "#f59e0b";
  if (colorClass === "red") hexColor = "#ef4444";
  if (colorClass === "blue") hexColor = "#3b82f6";

  return L.divIcon({
    html: `
      <div class="relative w-4 h-4 flex items-center justify-center">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" style="color: ${hexColor}"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 border border-white/20" style="background-color: ${hexColor}"></span>
      </div>
    `,
    className: "custom-leaflet-icon",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

// Help helper to update map center dynamically
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface CorridorMapProps {
  corridors: Corridor[];
  selectedCorridor: Corridor | null;
  onSelectCorridor: (corridor: Corridor | null) => void;
}

export default function CorridorMap({
  corridors,
  selectedCorridor,
  onSelectCorridor,
}: CorridorMapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [costFilter, setCostFilter] = useState("all"); // all, low, mid, high
  const [speedFilter, setSpeedFilter] = useState("all"); // all, instant, sameday, multi
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  // Reset Leaflet default styles to ensure CSS is loaded locally
  useEffect(() => {
    // Import Leaflet stylesheet dynamically
    import("leaflet/dist/leaflet.css");
  }, []);

  // Filter corridors
  const filteredCorridors = corridors.filter((c) => {
    // Search filter
    const matchesSearch =
      c.origin_country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.destination_country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.origin_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.destination_code.toLowerCase().includes(searchQuery.toLowerCase());

    // Cost filter
    // Low: < 3%, Mid: 3-5%, High: > 5%
    let matchesCost = true;
    if (costFilter === "low") matchesCost = c.average_cost_percent < 3.0;
    else if (costFilter === "mid") matchesCost = c.average_cost_percent >= 3.0 && c.average_cost_percent <= 5.0;
    else if (costFilter === "high") matchesCost = c.average_cost_percent > 5.0;

    // Speed filter
    // Instant: < 1 hour, Sameday: < 24 hours, Multi: >= 24 hours
    let matchesSpeed = true;
    if (speedFilter === "instant") matchesSpeed = c.average_speed_hours < 1.0;
    else if (speedFilter === "sameday") matchesSpeed = c.average_speed_hours >= 1.0 && c.average_speed_hours <= 24.0;
    else if (speedFilter === "multi") matchesSpeed = c.average_speed_hours > 24.0;

    return matchesSearch && matchesCost && matchesSpeed;
  });

  const getPolylineColor = (cost: number) => {
    if (cost < 3.0) return "#10b981"; // emerald-500
    if (cost <= 5.0) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  const handleSelectCorridor = (c: Corridor) => {
    onSelectCorridor(c);
    setMapCenter([(c.origin_lat + c.destination_lat) / 2, (c.origin_lng + c.destination_lng) / 2]);
    setMapZoom(3);
  };

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950/65 shadow-2xl">
      {/* Map Controls & Header */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 max-w-sm w-full bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-800/50 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-emerald-400" />
          Interactive Corridor Map
        </h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search country or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1 font-medium">Cost Tier</label>
            <select
              value={costFilter}
              onChange={(e) => setCostFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-1.5 text-[11px] text-slate-200 focus:outline-none"
            >
              <option value="all">All Costs</option>
              <option value="low">Low (&lt;3%)</option>
              <option value="mid">Mid (3-5%)</option>
              <option value="high">High (&gt;5%)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-1 font-medium">Settlement Speed</label>
            <select
              value={speedFilter}
              onChange={(e) => setSpeedFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-1.5 text-[11px] text-slate-200 focus:outline-none"
            >
              <option value="all">All Speeds</option>
              <option value="instant">Instant (&lt;1h)</option>
              <option value="sameday">Same Day (&lt;24h)</option>
              <option value="multi">Multi-Day (&gt;24h)</option>
            </select>
          </div>
        </div>
        <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
          <span>Showing {filteredCorridors.length} routes</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Cheap
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block ml-1"></span> Mid
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block ml-1"></span> Expensive
          </span>
        </div>
      </div>

      {/* React Leaflet Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full z-10"
        zoomControl={false}
        attributionControl={false}
      >
        <MapController center={mapCenter} zoom={mapZoom} />
        {/* Dark Matter Premium Base Map Layer */}
        <TileLayer url={process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"} />

        {/* Render routes */}
        {filteredCorridors.map((c) => {
          const color = getPolylineColor(c.average_cost_percent);
          const isSelected = selectedCorridor?.id === c.id;

          return (
            <React.Fragment key={c.id}>
              {/* Origin Marker */}
              <Marker position={[c.origin_lat, c.origin_lng]} icon={createPulseIcon("blue")}>
                <Popup>
                  <div className="text-xs p-1 text-slate-950">
                    <strong>{c.origin_country} (Origin)</strong>
                  </div>
                </Popup>
              </Marker>

              {/* Destination Marker */}
              <Marker position={[c.destination_lat, c.destination_lng]} icon={createPulseIcon(c.average_cost_percent < 3 ? "emerald" : c.average_cost_percent <= 5 ? "orange" : "red")}>
                <Popup>
                  <div className="text-xs p-1 text-slate-950">
                    <strong>{c.destination_country} (Destination)</strong>
                  </div>
                </Popup>
              </Marker>

              {/* Polyline Route */}
              <Polyline
                positions={[
                  [c.origin_lat, c.origin_lng],
                  [c.destination_lat, c.destination_lng],
                ]}
                eventHandlers={{
                  click: () => handleSelectCorridor(c),
                }}
                pathOptions={{
                  color: color,
                  weight: isSelected ? 4 : 2,
                  opacity: isSelected ? 0.9 : 0.4,
                  dashArray: isSelected ? "5, 5" : undefined,
                }}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Corridor details sliding drawer */}
      {selectedCorridor && (
        <div className="absolute top-4 right-4 z-[1000] max-w-sm w-full bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl p-5 text-slate-200 overflow-y-auto max-h-[560px]">
          <div className="flex justify-between items-start mb-4 border-b border-slate-800/80 pb-3">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Active Corridor</div>
              <h4 className="text-base font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
                {selectedCorridor.origin_country}
                <ArrowRight className="w-4 h-4 text-emerald-400" />
                {selectedCorridor.destination_country}
              </h4>
            </div>
            <button
              onClick={() => onSelectCorridor(null)}
              className="p-1 rounded-md bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick stats grid */}
          <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
            <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/40">
              <span className="text-[9px] text-slate-400 block uppercase">Avg Cost</span>
              <span className="text-sm font-bold text-emerald-400 mt-1 block">
                {selectedCorridor.average_cost_percent}%
              </span>
            </div>
            <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/40">
              <span className="text-[9px] text-slate-400 block uppercase">Avg Speed</span>
              <span className="text-sm font-bold text-blue-400 mt-1 block">
                {selectedCorridor.average_speed_hours}h
              </span>
            </div>
            <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/40">
              <span className="text-[9px] text-slate-400 block uppercase">Risk Index</span>
              <span className="text-sm font-bold text-amber-500 mt-1 block flex items-center justify-center gap-0.5">
                <AlertTriangle className="w-3 h-3" />
                {selectedCorridor.risk_score}/10
              </span>
            </div>
          </div>

          {/* Providers performance */}
          <div className="mb-4">
            <h5 className="text-xs font-semibold text-slate-300 mb-2">Provider Comparisons</h5>
            <div className="space-y-2">
              {selectedCorridor.providers.map((p: Provider) => {
                const totalCost = (p.fee_percent + p.fx_spread + p.fixed_fee / 5.0).toFixed(2);
                return (
                  <div
                    key={p.name}
                    className="bg-slate-950/40 hover:bg-slate-950/80 p-2.5 rounded-lg border border-slate-850 flex justify-between items-center transition-all"
                  >
                    <div>
                      <div className="text-[11px] font-semibold text-slate-100">{p.name}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        Fee: {p.fee_percent}% + Fx spread: {p.fx_spread}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-emerald-400">{totalCost}% cost</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        {p.settlement_time_hours < 1 ? "Instant" : `${p.settlement_time_hours} hrs`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Receive Options */}
          <div>
            <h5 className="text-xs font-semibold text-slate-300 mb-2">Available Channels</h5>
            <div className="flex flex-wrap gap-1.5">
              {selectedCorridor.receive_options.map((opt) => (
                <span
                  key={opt}
                  className="px-2 py-1 rounded bg-slate-950 text-[10px] text-slate-300 border border-slate-850 flex items-center gap-1"
                >
                  {opt === "Bank Deposit" ? (
                    <Landmark className="w-3 h-3 text-blue-400" />
                  ) : opt === "Mobile Wallet" ? (
                    <Wallet className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                  )}
                  {opt}
                </span>
              ))}
            </div>
          </div>

          {/* Synthetic marker notice */}
          <div className="mt-4 pt-3 border-t border-slate-850 text-[9px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-3 h-3 text-slate-500 shrink-0" />
            <span>Clearly labeled: All records are synthetic reference data.</span>
          </div>
        </div>
      )}
    </div>
  );
}
