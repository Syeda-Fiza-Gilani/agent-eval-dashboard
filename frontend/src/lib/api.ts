import { getToken } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Stat = {
  label: string;
  value: string;
  delta: number;
  trend: "up" | "down";
};

export type ChartPoint = {
  date: string;
  accuracy: number;
  latency: number;
};

export type RecentRun = {
  id: number;
  model: string;
  task: string;
  status: "success" | "fail";
  time: string;
};

export type Agent = {
  id: string;
  name: string;
  description: string;
  success_rate: number;
  runs: number;
  color: string;
};

export type Model = {
  id: string;
  name: string;
  provider: string;
  avg_accuracy: number;
  avg_latency_ms: number;
  total_runs: number;
  cost_per_1k: number;
  status: string;
};

export type EvalRun = {
  id: number;
  model: string;
  task: string;
  status: "success" | "fail";
  accuracy: number;
  latency_ms: number;
  cost: number;
  timestamp: string;
};

export type LogEntry = {
  id: number;
  timestamp: string;
  endpoint: string;
  status_code: number;
  duration_ms: number;
  level: "info" | "error";
};

async function fetchJSON<T>(path: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return res.json();
}

export const getStats = () => fetchJSON<Record<string, Stat>>("/api/stats");
export const getChartData = () => fetchJSON<ChartPoint[]>("/api/chart");
export const getRecentRuns = () => fetchJSON<RecentRun[]>("/api/recent-runs");
export const getAgents = () => fetchJSON<Agent[]>("/api/agents");
export const getModels = () => fetchJSON<Model[]>("/api/models");
export const getEvalRuns = () => fetchJSON<EvalRun[]>("/api/eval-runs");
export const getLogs = () => fetchJSON<LogEntry[]>("/api/logs");