'use client';

import React, { useState } from 'react';
import { Search, BrainCircuit, Loader2, Sparkles, Database } from 'lucide-react';
import { askDeployLens } from '@/lib/api';

export default function AskDeployLens() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await askDeployLens(query);
      setResult(res);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
      <div className="flex items-center space-x-2 text-sm font-bold text-white mb-3">
        <BrainCircuit className="h-4 w-4 text-indigo-400" />
        <span>Ask DeployLens Organizational Memory</span>
      </div>

      <form onSubmit={handleAsk} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about NovaCart's operational history (e.g., 'redis pool failures', 'order latency migration')..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          <span>Query</span>
        </button>
      </form>

      {result && (
        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1 text-indigo-400">
              <Database className="h-3.5 w-3.5" />
              Hindsight Organizational Memory Response
            </span>
            <span>Status: {result.hindsight_status}</span>
          </div>

          <p className="text-slate-200 whitespace-pre-line leading-relaxed">
            {result.answer}
          </p>
        </div>
      )}
    </div>
  );
}
