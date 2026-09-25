"use client";

import { useEffect, useState } from "react";
import { Braces, GitBranch, Headset } from "lucide-react";
import { getAgents, Agent } from "@/lib/api";

const ICONS: Record<string, any> = {
  "schema-extraction": Braces,
  "lead-routing": GitBranch,
  "customer-support": Headset,
};

export default function AgentCards() {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    getAgents().then(setAgents).catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {agents.map((agent) => {
        const Icon = ICONS[agent.id] ?? Braces;
        return (
          <div key={agent.id} className="bg-white rounded-4xl p-6 shadow-sm">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3"
              style={{ backgroundColor: `${agent.color}1A` }}
            >
              <Icon size={18} style={{ color: agent.color }} />
            </div>

            <h4 className="text-sm font-semibold text-cardText">{agent.name}</h4>
            <p className="text-[11px] text-muted mb-3">{agent.runs.toLocaleString()} runs / month</p>

            <p className="text-[10px] text-muted mb-1">Success rate</p>
            <div className="w-full h-2 rounded-full bg-background overflow-hidden mb-3">
              <div
                className="h-full rounded-full"
                style={{ width: `${agent.success_rate}%`, backgroundColor: agent.color }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-cardText">{agent.success_rate}% pass</span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${agent.color}1A`, color: agent.color }}
              >
                Live
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}