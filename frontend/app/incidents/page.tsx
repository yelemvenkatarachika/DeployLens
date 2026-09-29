'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, Search, ArrowRight, Loader2 } from 'lucide-react';
import { getIncidents } from '@/lib/api';
import { Incident } from '@/types';
import StatusBadge from '@/components/StatusBadge';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getIncidents()
      .then((data) => setIncidents(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = incidents.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.incident_id.toLowerCase().includes(search.toLowerCase()) ||
      (i.service_name && i.service_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-rose-500" />
            Production Incidents
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            NovaCart operational incident registry and historical memory correlates.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter incidents by title or service..."
            className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center space-x-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
          <span className="text-sm font-mono">Loading incidents...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((inc) => (
            <div
              key={inc.id}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg transition-all hover:border-indigo-500/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900">
                    {inc.incident_id}
                  </span>
                  <StatusBadge type="severity" value={inc.severity} />
                  <StatusBadge type="status" value={inc.status} />
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                  Service: <strong className="text-slate-200">{inc.service_name}</strong>
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-100">{inc.title}</h3>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed font-sans">{inc.description}</p>

              <div className="mt-4 flex flex-wrap items-center justify-between pt-3 border-t border-slate-900 text-xs font-mono text-slate-400 gap-2">
                <div className="flex items-center space-x-4">
                  <span>Error Rate: <strong className={inc.error_rate > 5 ? 'text-rose-400' : 'text-slate-200'}>{inc.error_rate}%</strong></span>
                  <span>Latency: <strong className={inc.latency_ms > 1000 ? 'text-amber-400' : 'text-slate-200'}>{inc.latency_ms}ms</strong></span>
                </div>

                <Link
                  href={`/incidents/${inc.incident_id}`}
                  className="flex items-center space-x-1.5 rounded-lg bg-indigo-600/20 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-500/30"
                >
                  <span>Investigate with DeployLens</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
