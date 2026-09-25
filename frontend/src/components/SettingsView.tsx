"use client";

import { useState } from "react";

export default function SettingsView() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [failureAlerts, setFailureAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const toggles = [
    { label: "Email alerts on new eval runs", value: emailAlerts, set: setEmailAlerts },
    { label: "Alert me on failed runs", value: failureAlerts, set: setFailureAlerts },
    { label: "Weekly performance digest", value: weeklyDigest, set: setWeeklyDigest },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-4xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-cardText mb-4">Profile</h2>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-accentLavender/40 flex items-center justify-center text-sidebar text-lg font-semibold">
            AE
          </div>
          <div>
            <p className="text-sm font-semibold text-cardText">Agent Evals Admin</p>
            <p className="text-xs text-muted">admin@agentevals.dev</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted mb-1.5 block">Display name</label>
            <input
              defaultValue="Agent Evals Admin"
              className="w-full bg-background rounded-xl px-4 py-2.5 text-sm text-cardText outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-muted mb-1.5 block">Email</label>
            <input
              defaultValue="admin@agentevals.dev"
              className="w-full bg-background rounded-xl px-4 py-2.5 text-sm text-cardText outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-4xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-cardText mb-4">Notifications</h2>
        <div className="flex flex-col gap-4">
          {toggles.map((t) => (
            <div key={t.label} className="flex items-center justify-between">
              <p className="text-sm text-cardText">{t.label}</p>
              <button
                onClick={() => t.set(!t.value)}
                className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${
                  t.value ? "bg-sidebar justify-end" : "bg-background justify-start"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-4xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-cardText mb-4">API Key</h2>
        <div className="flex items-center gap-3">
          <input
            readOnly
            value="sk-••••••••••••••••••••3f9a"
            className="flex-1 bg-background rounded-xl px-4 py-2.5 text-sm text-muted outline-none font-mono"
          />
          <button className="text-xs font-medium px-4 py-2.5 rounded-xl bg-sidebar text-white flex-shrink-0">
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}