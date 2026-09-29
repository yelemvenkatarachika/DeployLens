'use client';

import React, { useEffect, useState } from 'react';
import { Compass, CheckCircle2, XCircle, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import { getPatterns } from '@/lib/api';
import { RecurringPattern } from '@/types';

export default function PatternsPage() {
  const [patterns, setPatterns] = useState<RecurringPattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatterns()
      .then((data) => setPatterns(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Compass className="h-6 w-6 text-purple-400" />
            Discovered Operational Patterns
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Cross-incident patterns synthesized from Hindsight long-term operational memory.
          </p>
        </div>

        <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-mono font-semibold text-indigo-300 border border-indigo-500/30">
          Synthesized from 63 Hindsight Memories
        </span>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center space-x-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
          <span className="text-sm font-mono">Synthesizing operational patterns...</span>
        </div>
      ) : (
        <div className="grid gap-6">
          {patterns.map((pat) => (
            <div
              key={pat.id}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition-all hover:border-indigo-500/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center space-x-3">
                  <span className="rounded font-mono text-xs font-bold text-purple-300 bg-purple-950/80 px-2.5 py-1 border border-purple-800">
                    {pat.id}
                  </span>
                  <h3 className="text-base font-bold text-white">{pat.name}</h3>
                </div>

                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="text-slate-400">
                    Observed: <strong className="text-slate-200">{pat.observed_count} incidents</strong>
                  </span>
                  <span className="rounded bg-emerald-500/10 px-2.5 py-0.5 text-emerald-400 font-bold border border-emerald-500/30">
                    Confidence: {pat.confidence}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 space-y-2">
                  <span className="text-slate-500 block">Associated Service:</span>
                  <span className="text-indigo-400 font-bold block">{pat.associated_service}</span>
                  <span className="text-slate-500 block pt-1">Trigger Condition:</span>
                  <span className="text-slate-300 text-[11px] font-sans">{pat.trigger_condition}</span>
                </div>

                <div className="rounded-lg bg-emerald-950/20 p-3.5 border border-emerald-900/40 text-emerald-300 space-y-1">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified Successful Fix:
                  </span>
                  <p className="text-[11px] font-sans pt-1 leading-relaxed">{pat.successful_historical_fix}</p>
                </div>

                <div className="rounded-lg bg-rose-950/20 p-3.5 border border-rose-900/40 text-rose-300 space-y-1">
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    Known Failed Fix (Anti-pattern):
                  </span>
                  <p className="text-[11px] font-sans pt-1 leading-relaxed">{pat.failed_historical_fix}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
