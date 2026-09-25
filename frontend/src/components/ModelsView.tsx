"use client";

import { useEffect, useState } from "react";
import { getModels, Model } from "@/lib/api";

export default function ModelsView() {
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    getModels().then(setModels).catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {models.map((model) => (
        <div key={model.id} className="bg-white rounded-4xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-cardText">{model.name}</h3>
              <p className="text-xs text-muted">{model.provider}</p>
            </div>
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-600">
              {model.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background rounded-2xl p-3">
              <p className="text-[10px] text-muted mb-1">Avg Accuracy</p>
              <p className="text-lg font-bold text-cardText">{model.avg_accuracy}%</p>
            </div>
            <div className="bg-background rounded-2xl p-3">
              <p className="text-[10px] text-muted mb-1">Avg Latency</p>
              <p className="text-lg font-bold text-cardText">{model.avg_latency_ms}ms</p>
            </div>
            <div className="bg-background rounded-2xl p-3">
              <p className="text-[10px] text-muted mb-1">Total Runs</p>
              <p className="text-lg font-bold text-cardText">{model.total_runs.toLocaleString()}</p>
            </div>
            <div className="bg-background rounded-2xl p-3">
              <p className="text-[10px] text-muted mb-1">Cost / 1K calls</p>
              <p className="text-lg font-bold text-cardText">${model.cost_per_1k.toFixed(2)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}