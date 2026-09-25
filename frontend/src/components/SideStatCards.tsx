"use client";

import { useEffect, useState } from "react";
import { Clock, ArrowUpRight } from "lucide-react";
import { getStats, Stat } from "@/lib/api";

export default function SideStatCards() {
  const [stats, setStats] = useState<Record<string, Stat> | null>(null);

  useEffect(() => {
    getStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:flex lg:flex-col gap-4 h-full">
      <div className="min-h-[140px] flex-1 bg-accentLavender rounded-4xl p-5 shadow-lg text-white flex flex-col justify-between">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
          <Clock size={16} />
        </div>
        <div>
          <p className="text-xs text-white/70 mb-1">Avg. Latency (TTFT)</p>
          <p className="text-xl font-bold">{stats?.avg_ttft.value ?? "—"}</p>
        </div>
      </div>

      <div className="min-h-[140px] flex-1 bg-accentPink rounded-4xl p-5 shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
          <ArrowUpRight size={16} />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-white/80 mb-1">API Cost (24h)</p>
            <p className="text-xl font-bold">{stats?.api_cost.value ?? "—"}</p>
          </div>
          <button className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}