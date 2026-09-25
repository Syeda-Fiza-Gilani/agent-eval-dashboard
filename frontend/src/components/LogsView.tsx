"use client";

import { useEffect, useState } from "react";
import { getLogs, LogEntry } from "@/lib/api";

export default function LogsView() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    getLogs().then(setLogs).catch(console.error);
  }, []);

  return (
    <div className="bg-white rounded-4xl p-6 shadow-sm">
      <h2 className="text-base font-semibold text-cardText mb-4">Request Logs</h2>

      <div className="flex flex-col gap-1 max-h-[560px] overflow-y-auto font-mono text-xs">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-background transition-colors"
          >
            <span className="text-muted w-32 flex-shrink-0">{log.timestamp}</span>
            <span
              className={`w-14 flex-shrink-0 font-semibold ${
                log.status_code >= 400 ? "text-rose-500" : "text-emerald-600"
              }`}
            >
              {log.status_code}
            </span>
            <span className="text-cardText flex-1 min-w-0 truncate">{log.endpoint}</span>
            <span className="text-muted w-16 flex-shrink-0 text-right">{log.duration_ms}ms</span>
          </div>
        ))}
      </div>
    </div>
  );
}