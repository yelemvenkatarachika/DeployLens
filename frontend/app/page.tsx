'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  GitCommit, 
  Database, 
  Compass, 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  BrainCircuit,
  Loader2
} from 'lucide-react';
import { getDashboardData } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import AskDeployLens from '@/components/AskDeployLens';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData()
      .then((res) => setData(res))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center space-x-3 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        <span className="text-sm font-mono">Loading DeployLens Dashboard...</span>
      </div>
    );
  }

  const metrics = data?.metrics || {
    active_incidents: 1,
    deployments_today: 6,
    remembered_incidents: 12,
    recurring_patterns: 4
  };

  return (
    <div className="space-y-8">
      {/* Hero Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Production Overview
            <span className="text-xs font-mono font-normal bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30">
              NovaCart SaaS
            </span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Memory-powered change intelligence investigating production failure patterns.
          </p>
        </div>

        <Link
          href="/incidents/INC-2051"
          className="flex items-center space-x-2 rounded-lg bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition-all"
        >
          <Zap className="h-4 w-4 animate-pulse" />
          <span>Investigate Active Outage (INC-2051)</span>
        </Link>
      </div>

      {/* Top 4 Dashboard Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-rose-500/30 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between text-rose-400 text-xs font-mono mb-2">
            <span>Active Incidents</span>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics.active_incidents}</div>
          <div className="mt-2 text-[11px] text-rose-300 font-mono flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
            SEV-1 Checkout Outage Active
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between text-blue-400 text-xs font-mono mb-2">
            <span>Deployments Today</span>
            <GitCommit className="h-4 w-4" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics.deployments_today}</div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            Latest: payment-service v2.8.1
          </div>
        </div>

        <div className="rounded-xl border border-indigo-500/30 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between text-indigo-400 text-xs font-mono mb-2">
            <span>Remembered Incidents</span>
            <Database className="h-4 w-4" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics.remembered_incidents}</div>
          <div className="mt-2 text-[11px] text-indigo-300 font-mono">
            Stored in Hindsight Bank
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between text-purple-400 text-xs font-mono mb-2">
            <span>Recurring Patterns</span>
            <Compass className="h-4 w-4" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics.recurring_patterns}</div>
          <div className="mt-2 text-[11px] text-purple-300 font-mono">
            Outcome-Learned Rules
          </div>
        </div>
      </div>

      {/* Ask DeployLens Search Box */}
      <AskDeployLens />

      {/* Main Grid: Active Incidents & Recent Deployments */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active & Recent Incidents */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Zap className="h-4 w-4 text-rose-400" />
              Incidents Requiring Investigation
            </h2>
            <Link href="/incidents" className="text-xs text-indigo-400 hover:underline font-mono">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {data?.active_incidents_list?.map((inc: any) => (
              <div
                key={inc.id}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4 transition-all hover:border-indigo-500/40"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">
                      {inc.incident_id}
                    </span>
                    <StatusBadge type="severity" value={inc.severity} />
                    <StatusBadge type="status" value={inc.status} />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {inc.service_name}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-slate-100">{inc.title}</h3>

                <div className="mt-3 flex items-center justify-between border-t border-slate-900 pt-2 text-xs font-mono text-slate-400">
                  <span>Error Rate: <strong className="text-rose-400">{inc.error_rate}%</strong></span>
                  <Link
                    href={`/incidents/${inc.incident_id}`}
                    className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    <span>Investigate</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Deployments */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <GitCommit className="h-4 w-4 text-blue-400" />
              Recent Production Deployments
            </h2>
            <Link href="/deployments" className="text-xs text-indigo-400 hover:underline font-mono">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recent_deployments?.map((dep: any) => (
              <div
                key={dep.id}
                className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="font-bold text-slate-200">{dep.deployment_id}</span>
                    <span className="text-slate-400">{dep.service_name}</span>
                    <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-300 border border-blue-500/20">
                      v{dep.version}
                    </span>
                  </div>
                  <div className="text-slate-500 mt-1 font-mono text-[11px]">
                    By {dep.author}
                  </div>
                </div>

                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                  {dep.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Recurring Pattern Preview */}
      <div className="rounded-xl border border-indigo-500/30 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center space-x-2 text-indigo-400">
            <BrainCircuit className="h-5 w-5" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Primary Recurring Pattern Discovered in Memory
            </h3>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
            Verified Resolution Rate: 100%
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3.5">
            <span className="text-slate-500 block mb-1">Pattern Name:</span>
            <span className="text-slate-100 font-bold">Checkout + Redis Pool Exhaustion</span>
            <span className="text-slate-400 block mt-2 text-[11px]">Observed in 4 incidents</span>
          </div>

          <div className="rounded-lg border border-rose-900/40 bg-rose-950/20 p-3.5 text-rose-300">
            <span className="text-rose-400 font-semibold block mb-1">Known Failed Fix:</span>
            <span>Restart checkout-api (Attempted 3x, 0 permanent fixes)</span>
          </div>

          <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-3.5 text-emerald-300">
            <span className="text-emerald-400 font-semibold block mb-1">Verified Resolution:</span>
            <span>Increase PAYMENT_REDIS_POOL_SIZE from 20 to 50</span>
          </div>
        </div>
      </div>
    </div>
  );
}
