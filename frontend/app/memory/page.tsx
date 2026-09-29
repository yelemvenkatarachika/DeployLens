'use client';

import React, { useEffect, useState } from 'react';
import { 
  Database, 
  Search, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  Loader2, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { getMemorySearch, getMemoryStats } from '@/lib/api';
import { MemoryItem, MemoryStats } from '@/types';
import MemoryCard from '@/components/MemoryCard';
import MemoryGrowthChart from '@/components/MemoryGrowthChart';

export default function MemoryExplorerPage() {
  const [query, setQuery] = useState('');
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatsAndMemories = (q: string = '') => {
    setLoading(true);
    Promise.all([getMemorySearch(q), getMemoryStats()])
      .then(([searchRes, statsRes]) => {
        setMemories(searchRes.memories);
        setStats(statsRes);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatsAndMemories('');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatsAndMemories(query);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Database className="h-6 w-6 text-indigo-400" />
            Hindsight Memory Explorer
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Inspect persistent organizational incident memories, deployment facts, resolutions, and anti-patterns.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5">
          <span className="text-slate-400">Hindsight Bank:</span>
          <span className="font-bold text-indigo-400">novacart-production-memory</span>
        </div>
      </div>

      {/* Memory Stats 5-Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-xl border border-indigo-500/30 bg-slate-900/80 p-4 shadow-lg">
            <span className="text-xs font-mono text-slate-400 block">Total Memories</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{stats.total_memories}</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
            <span className="text-xs font-mono text-slate-400 block">Deployments</span>
            <span className="text-2xl font-extrabold text-blue-400 mt-1 block">{stats.deployments_remembered}</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
            <span className="text-xs font-mono text-slate-400 block">Incidents</span>
            <span className="text-2xl font-extrabold text-amber-400 mt-1 block">{stats.incidents_remembered}</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
            <span className="text-xs font-mono text-slate-400 block">Resolutions</span>
            <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{stats.resolutions_remembered}</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
            <span className="text-xs font-mono text-slate-400 block">Failed Fixes</span>
            <span className="text-2xl font-extrabold text-rose-400 mt-1 block">{stats.failed_approaches_remembered}</span>
          </div>
        </div>
      )}

      {/* Growth Visualization */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
            Operational Memory Growth & Accumulation
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Memory units accumulate over repeated incidents
          </span>
        </div>
        <MemoryGrowthChart growthData={stats?.memory_growth || []} />
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Hindsight organizational memory (e.g., 'redis checkout failures', 'payment pool', 'INC-1042')..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-4 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none shadow-md"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span>Search Memory</span>
        </button>
      </form>

      {/* Memory Results Grid */}
      {loading ? (
        <div className="flex h-48 items-center justify-center space-x-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
          <span className="text-sm font-mono">Querying Hindsight vector memory...</span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Showing {memories.length} recalled memory units</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Hindsight Status: {stats?.hindsight_status || 'Connected'}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {memories.map((mem) => (
              <MemoryCard key={mem.id} memory={mem} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
