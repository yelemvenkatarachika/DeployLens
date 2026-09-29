'use client';

import React, { useEffect, useState } from 'react';
import { GitCommit, Search, ShieldAlert, CheckCircle2, Loader2, Database, AlertTriangle } from 'lucide-react';
import { getDeployments } from '@/lib/api';
import { Deployment } from '@/types';

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getDeployments()
      .then((data) => setDeployments(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = deployments.filter(
    (d) =>
      d.deployment_id.toLowerCase().includes(search.toLowerCase()) ||
      (d.service_name && d.service_name.toLowerCase().includes(search.toLowerCase())) ||
      d.author.toLowerCase().includes(search.toLowerCase()) ||
      d.change_summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <GitCommit className="h-6 w-6 text-blue-400" />
            Production Deployments Registry
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            NovaCart deployment history indexed in Hindsight organizational memory.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter deployments by service or author..."
            className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center space-x-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
          <span className="text-sm font-mono">Loading deployment history...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((dep) => {
            const isHeroDep = dep.deployment_id === 'DEP-1837';
            return (
              <div
                key={dep.id}
                className={`rounded-xl border p-5 shadow-lg transition-all ${
                  isHeroDep
                    ? 'border-purple-500/50 bg-purple-950/20'
                    : 'border-slate-800 bg-slate-900/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3 font-mono text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-white bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                      {dep.deployment_id}
                    </span>
                    <span className="text-indigo-400 font-bold text-sm">{dep.service_name}</span>
                    <span className="rounded bg-blue-500/10 px-2 py-0.5 text-blue-300 border border-blue-500/20">
                      v{dep.version}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-400">
                    <span>SHA: {dep.commit_sha}</span>
                    <span>By: {dep.author}</span>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-400 border border-emerald-500/20">
                      {dep.status}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-100">{dep.change_summary}</p>

                {/* Config diffs if any */}
                {dep.config_changes && Object.keys(dep.config_changes).length > 0 && (
                  <div className="mt-3 rounded-lg bg-slate-950 p-3 border border-purple-900/40 text-xs font-mono">
                    <span className="text-purple-400 font-bold block mb-1">Config Changes Introduced:</span>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(dep.config_changes).map(([k, v]) => (
                        <span key={k} className="rounded bg-purple-950/60 px-2 py-0.5 text-purple-300 border border-purple-800">
                          {k} = <strong>{String(v)}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Timestamp: {new Date(dep.timestamp).toLocaleString()}</span>
                  {isHeroDep && (
                    <span className="text-rose-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Associated with Active Incident INC-2051
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
