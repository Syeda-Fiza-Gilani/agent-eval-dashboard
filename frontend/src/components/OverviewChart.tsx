"use client";

import { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { getChartData, getStats, ChartPoint, Stat } from "@/lib/api";

const TIMEFRAMES = ["Weekly", "Monthly", "Quarterly"];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-2xl px-4 py-2 shadow-lg text-cardText">
        <p className="text-xs text-muted mb-1">{label}</p>
        <p className="text-sm font-semibold">{payload[0].value}% accuracy</p>
        <p className="text-xs text-muted">{payload[0].payload.latency}ms latency</p>
      </div>
    );
  }
  return null;
}

export default function OverviewChart() {
  const [allData, setAllData] = useState<ChartPoint[]>([]);
  const [stats, setStats] = useState<Record<string, Stat> | null>(null);
  const [timeframe, setTimeframe] = useState("Monthly");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    getChartData().then(setAllData).catch(console.error);
    getStats().then(setStats).catch(console.error);
  }, []);

  // Weekly = last 7 points, Monthly = all 14, Quarterly = every other point (sparser view)
  const data =
    timeframe === "Weekly"
      ? allData.slice(-7)
      : timeframe === "Quarterly"
      ? allData.filter((_, i) => i % 2 === 0)
      : allData;

  const latestAccuracy = data.length ? data[data.length - 1].accuracy : 0;

  return (
    <div className="bg-sidebar rounded-4xl p-6 shadow-lg text-white h-full flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold">Overview</h2>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-1 text-xs bg-white/10 rounded-full px-3 py-1.5 hover:bg-white/20 transition-colors"
          >
            {timeframe} <ChevronDown size={12} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-lg py-1 z-10">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf);
                    setMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs ${
                    tf === timeframe
                      ? "text-sidebar font-semibold"
                      : "text-cardText hover:bg-background"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold">{latestAccuracy}%</span>
        <span className="text-xs text-white/60">Accuracy</span>
      </div>

      <div className="flex-1 min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF758F" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#FF758F" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={timeframe === "Quarterly" ? 0 : 2}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="accuracy"
              stroke="#FF758F"
              strokeWidth={3}
              fill="url(#accuracyGradient)"
              activeDot={{ r: 6, fill: "#FF758F", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4 pt-1 pb-1 border-t border-white/10">
        <div>
          <p className="text-white/50 text-[10px] mb-1">Active Agents</p>
          <p className="text-sm font-semibold">12</p>
        </div>
        <div>
          <p className="text-white/50 text-[10px] mb-1">Total Runs</p>
          <p className="text-sm font-semibold">{stats?.total_runs.value ?? "—"}</p>
        </div>
        <div>
          <p className="text-white/50 text-[10px] mb-1">Schema Pass Rate</p>
          <p className="text-sm font-semibold">{stats?.schema_pass_rate.value ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}