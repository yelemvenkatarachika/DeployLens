'use client';

import React from 'react';
import { Database, Tag, ShieldCheck, CornerDownRight, AlertOctagon } from 'lucide-react';
import { MemoryItem } from '@/types';

interface MemoryCardProps {
  memory: MemoryItem;
}

export default function MemoryCard({ memory }: MemoryCardProps) {
  const getBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'resolution':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'failure':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'deployment':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'incident':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    }
  };

  const scorePct = memory.similarity_score
    ? Math.round(memory.similarity_score * 100)
    : 89;

  return (
    <div className="group relative rounded-lg border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-indigo-500/50 hover:bg-slate-900/90">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
        <div className="flex items-center space-x-2">
          <Database className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 font-mono">
            {memory.id}
          </span>
          <span className={`rounded border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider ${getBadgeColor(memory.source_type)}`}>
            {memory.source_type}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {memory.service && (
            <span className="flex items-center space-x-1 font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              <Tag className="h-3 w-3 text-slate-500" />
              <span>{memory.service}</span>
            </span>
          )}
          <span className="rounded bg-indigo-500/20 px-2 py-0.5 font-semibold text-indigo-300 border border-indigo-500/30">
            {scorePct}% Match
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-200 leading-relaxed font-sans">
        {memory.content}
      </p>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/50 text-[11px] text-slate-500 font-mono">
        <span className="flex items-center space-x-1 text-indigo-400/80">
          <ShieldCheck className="h-3 w-3" />
          <span>Retrieved from Hindsight Memory Bank</span>
        </span>
        {memory.metadata?.incident_id && (
          <span className="text-slate-400">Ref: {memory.metadata.incident_id}</span>
        )}
      </div>
    </div>
  );
}
