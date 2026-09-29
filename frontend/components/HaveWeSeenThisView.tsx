'use client';

import React, { useState } from 'react';
import { 
  History, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Database, 
  Loader2, 
  ShieldCheck 
} from 'lucide-react';
import { recallSimilarIncidents } from '@/lib/api';

interface HaveWeSeenThisViewProps {
  incidentId: string;
}

export default function HaveWeSeenThisView({ incidentId }: HaveWeSeenThisViewProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRecall = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await recallSimilarIncidents(incidentId);
      setData(res);
    } catch (e: any) {
      setError(e.message || 'Failed to query Hindsight memory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-indigo-500/30 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <History className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-white">Have We Seen This Before?</h3>
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
              Hindsight Vector Recall
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Queries Hindsight long-term operational memory to identify past incidents with identical failure patterns.
          </p>
        </div>

        <button
          onClick={handleRecall}
          disabled={loading}
          className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Querying Hindsight Bank...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Query Operational Memory</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 mb-4">
          {error}
        </div>
      )}

      {!data && !loading && (
        <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-800 rounded-lg">
          <Database className="h-10 w-10 text-slate-600 mb-3" />
          <p className="text-sm font-medium text-slate-300">
            Click "Query Operational Memory" to recall matching historical incidents.
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            DeployLens will search past NovaCart outages, root causes, successful fixes, and failed attempts stored in Hindsight.
          </p>
        </div>
      )}

      {loading && (
        <div className="py-12 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mx-auto" />
          <p className="text-sm font-medium text-slate-300">Retrieving similar incidents from Hindsight memory bank...</p>
          <p className="text-xs text-slate-500 font-mono">bank: novacart-production-memory | vector similarity search</p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-lg bg-slate-950 p-3 border border-slate-800 text-xs font-mono">
            <span className="text-slate-300">
              Matches Found: <strong className="text-indigo-400">{data.total_matches} historical incidents</strong>
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Hindsight Memories Used: {data.hindsight_memories_used}
            </span>
          </div>

          <div className="grid gap-4">
            {data.similar_incidents?.map((inc: any, idx: number) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 transition-all hover:border-indigo-500/40"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="rounded bg-indigo-600/20 px-2.5 py-1 text-xs font-bold font-mono text-indigo-300 border border-indigo-500/30">
                      {inc.incident_id}
                    </span>
                    <h4 className="text-base font-bold text-slate-100">{inc.title}</h4>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                    Similarity: {inc.similarity_percentage}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  {/* Symptoms & Cause */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-400 font-mono uppercase tracking-wider block mb-1">
                        Observed Symptoms:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {inc.symptoms?.map((sym: string, i: number) => (
                          <span key={i} className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-slate-300 font-mono">
                            {sym}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 font-mono uppercase tracking-wider block mb-1">
                        Historical Root Cause:
                      </span>
                      <p className="text-slate-200 bg-slate-900/60 p-2.5 rounded border border-slate-800/80 leading-relaxed">
                        {inc.previous_cause}
                      </p>
                    </div>
                  </div>

                  {/* Successful & Failed Fixes */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-1 mb-1 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Previous Successful Fix:
                      </span>
                      <p className="text-emerald-300 bg-emerald-950/20 p-2.5 rounded border border-emerald-900/40 leading-relaxed">
                        {inc.previous_successful_fix}
                      </p>
                    </div>

                    {inc.previous_failed_attempts?.length > 0 && (
                      <div>
                        <span className="text-rose-400 font-mono uppercase tracking-wider flex items-center gap-1 mb-1 font-semibold">
                          <XCircle className="h-3.5 w-3.5" />
                          Previous Failed Fixes:
                        </span>
                        <div className="space-y-1">
                          {inc.previous_failed_attempts.map((failed: string, i: number) => (
                            <p key={i} className="text-rose-300 bg-rose-950/20 p-2 rounded border border-rose-900/30 text-[11px]">
                              • {failed}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
