"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import OverviewChart from "@/components/OverviewChart";
import SideStatCards from "@/components/SideStatCards";
import AgentCards from "@/components/AgentCards";
import RecentRuns from "@/components/RecentRuns";
import MapWidget from "@/components/MapWidget";
import EvalsView from "@/components/EvalsView";
import ModelsView from "@/components/ModelsView";
import LogsView from "@/components/LogsView";
import SettingsView from "@/components/SettingsView";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row p-4 lg:p-6 gap-4 lg:gap-6">
      <Sidebar
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col gap-4 lg:gap-6 min-w-0">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} onNavigate={setActiveView} />

        {activeView === "home" && (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-auto xl:h-80">
              <div className="xl:col-span-2 h-80 xl:h-full">
                <OverviewChart />
              </div>
              <SideStatCards />
            </div>
            <AgentCards />
          </>
        )}
        {activeView === "evals" && <EvalsView />}
        {activeView === "models" && <ModelsView />}
        {activeView === "logs" && <LogsView />}
        {activeView === "settings" && <SettingsView />}
      </main>

      <div className="flex flex-col w-full lg:w-80 flex-shrink-0 gap-4 lg:gap-6">
        <RecentRuns />
        <MapWidget />
      </div>
    </div>
  );
}