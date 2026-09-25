"use client";

import { useEffect, useRef, useState } from "react";
import { Search, User, Settings, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

type TopHeaderProps = {
  onMenuClick: () => void;
  onNavigate: (view: string) => void;
};

export default function TopHeader({ onMenuClick, onNavigate }: TopHeaderProps) {
   const { logout } = useAuth();
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

  return (
    <header className="flex items-center justify-between mb-2 lg:mb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-cardText flex-shrink-0"
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="text-xs text-muted mb-0.5 hidden sm:block">Primary</p>
          <h1 className="text-lg lg:text-xl font-bold text-cardText">Dashboard</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm w-40 lg:w-64">
          <Search size={16} className="text-muted flex-shrink-0" />
          <input
            placeholder="Search"
            className="bg-transparent outline-none text-sm text-cardText placeholder:text-muted w-full min-w-0"
          />
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-10 h-10 rounded-full bg-accentLavender/40 flex items-center justify-center text-sidebar text-xs font-semibold flex-shrink-0 hover:bg-accentLavender/60 transition-colors overflow-hidden"
          >
            AE
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg py-2 z-50">
              <button
                onClick={() => {
                  onNavigate("settings");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-cardText hover:bg-background text-left"
              >
                <User size={14} /> Profile
              </button>
              <button
                onClick={() => {
                  onNavigate("settings");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-cardText hover:bg-background text-left"
              >
                <Settings size={14} /> Settings
              </button>
               <div className="border-t border-background my-1" />
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-500 hover:bg-background text-left"
              >
                <LogOut size={14} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}