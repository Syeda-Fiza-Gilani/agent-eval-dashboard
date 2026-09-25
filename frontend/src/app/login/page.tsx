"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Lock, User as UserIcon } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-4xl shadow-lg p-8">
        <div className="w-12 h-12 rounded-2xl bg-sidebar flex items-center justify-center text-white font-bold mb-6">
          AE
        </div>
        <h1 className="text-xl font-bold text-cardText mb-1">Welcome back</h1>
        <p className="text-sm text-muted mb-6">Sign in to your Agent Evaluation Dashboard</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-muted mb-1.5 block">Username</label>
            <div className="flex items-center gap-2 bg-background rounded-xl px-4 py-2.5">
              <UserIcon size={16} className="text-muted" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent outline-none text-sm text-cardText w-full"
                placeholder="admin"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted mb-1.5 block">Password</label>
            <div className="flex items-center gap-2 bg-background rounded-xl px-4 py-2.5">
              <Lock size={16} className="text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent outline-none text-sm text-cardText w-full"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-sidebar text-white text-sm font-medium rounded-xl py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-xs text-muted mt-6 text-center">
          Demo credentials: <span className="font-medium text-cardText">admin</span> /{" "}
          <span className="font-medium text-cardText">admin123</span>
        </p>
      </div>
    </div>
  );
}