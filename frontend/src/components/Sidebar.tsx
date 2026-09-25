"use client";

import { Home, LineChart, Cpu, FileText, Settings } from "lucide-react";

const NAV_ITEMS = [
  { id: "home", icon: Home, label: "Home" },
  { id: "evals", icon: LineChart, label: "Evals" },
  { id: "models", icon: Cpu, label: "Models" },
  { id: "logs", icon: FileText, label: "Logs" },
  { id: "settings", icon: Settings, label: "Settings" },
];

type SidebarProps = {
  activeView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ activeView, onNavigate, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full lg:h-auto z-50 flex flex-col items-center w-16 py-6 bg-sidebar lg:rounded-4xl shadow-lg transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
      

        <div className="w-9 h-9 rounded-xl bg-white/20 mb-8 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs">AE</span>
        </div>

        <nav className="flex flex-col gap-3">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
            const active = activeView === id;
            return (
              <button
                key={id}
                title={label}
                onClick={() => onNavigate(id)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
                  active
                    ? "bg-white text-sidebar"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={16} strokeWidth={2} />
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}