"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { getEvalRuns, EvalRun } from "@/lib/api";

export default function EvalsView() {
  const [runs, setRuns] = useState<EvalRun[]>([]);
  const [filter, setFilter] = useState<"all" | "success" | "fail">("all");

  useEffect(() => {
    getEvalRuns().then(setRuns).catch(console.error);
  }, []);

  const visible = filter === "all" ? runs : runs.filter((r) => r.status === filter);
  const passCount = runs.filter((r) => r.status === "success").length;
  const passRate = runs.length ? Math.round((passCount / runs.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <p className="text-xs text-muted mb-1">Total Evals</p>
          <p className="text-2xl font-bold text-cardText">{runs.length}</p>
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <p className="text-xs text-muted mb-1">Pass Rate</p>
          <p className="text-2xl font-bold text-cardText">{passRate}%</p>
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <p className="text-xs text-muted mb-1">Failed Runs</p>
          <p className="text-2xl font-bold text-rose-500">{runs.length - passCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-4xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-cardText">Eval Runs</h2>
          <div className="flex gap-2">
            {(["all", "success", "fail"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                  filter === f ? "bg-sidebar text-white" : "bg-background text-muted"
                }`}
              >
                {f === "all" ? "All" : f === "success" ? "Passed" : "Failed"}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-background">
                <th className="pb-3 font-medium">Model</th>
                <th className="pb-3 font-medium">Task</th>
                <th className="pb-3 font-medium">Accuracy</th>
                <th className="pb-3 font-medium">Latency</th>
                <th className="pb-3 font-medium">Cost</th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((run) => (
                <tr key={run.id} className="border-b border-background last:border-0">
                  <td className="py-3 font-medium text-cardText">{run.model}</td>
                  <td className="py-3 text-muted">{run.task}</td>
                  <td className="py-3 text-cardText">{run.accuracy}%</td>
                  <td className="py-3 text-muted">{run.latency_ms}ms</td>
                  <td className="py-3 text-muted">${run.cost.toFixed(4)}</td>
                  <td className="py-3 text-muted">{run.timestamp}</td>
                  <td className="py-3">
                    {run.status === "success" ? (
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                        <CheckCircle2 size={14} /> Pass
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-500 text-xs font-medium">
                        <XCircle size={14} /> Fail
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}