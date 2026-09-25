"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import { getRecentRuns, RecentRun } from "@/lib/api";

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function RecentRuns() {
  const [runs, setRuns] = useState<RecentRun[]>([]);
  const [filter, setFilter] = useState<"all" | "failed">("all");

  useEffect(() => {
    getRecentRuns().then(setRuns).catch(console.error);
  }, []);

  const visible = filter === "all" ? runs : runs.filter((r) => r.status === "fail");

  return (
    <div className="bg-white rounded-4xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-cardText text-sm">Recent Test Runs</h3>
        <button className="text-xs text-muted flex items-center gap-0.5">
          View All <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`text-xs px-3 py-1.5 rounded-full font-medium ${
            filter === "all" ? "bg-sidebar text-white" : "bg-background text-muted"
          }`}
        >
          All Runs
        </button>
        <button
          onClick={() => setFilter("failed")}
          className={`text-xs px-3 py-1.5 rounded-full font-medium ${
            filter === "failed" ? "bg-sidebar text-white" : "bg-background text-muted"
          }`}
        >
          Failed
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {visible.map((run) => (
          <div key={run.id} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accentLavender/20 text-sidebar flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {initials(run.model)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-cardText truncate">{run.model}</p>
              <p className="text-[11px] text-muted truncate">
                {run.task} · {run.time}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  run.status === "success"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-rose-100 text-rose-500"
                }`}
              >
                {run.status === "success" ? "Pass" : "Fail"}
              </span>
              <ExternalLink size={12} className="text-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}