'use client';

import React from 'react';
import { 
  GitCommit, 
  Settings, 
  AlertTriangle, 
  Zap, 
  Wrench, 
  CheckCircle2, 
  Database 
} from 'lucide-react';
import { TimelineEvent } from '@/types';

interface TimelineViewProps {
  events: TimelineEvent[];
}

export default function TimelineView({ events }: TimelineViewProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'deployment':
        return <GitCommit className="h-4 w-4 text-blue-400" />;
      case 'config':
        return <Settings className="h-4 w-4 text-purple-400" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'incident':
        return <Zap className="h-4 w-4 text-rose-400" />;
      case 'investigation':
        return <Wrench className="h-4 w-4 text-cyan-400" />;
      case 'resolution':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'memory':
        return <Database className="h-4 w-4 text-indigo-400" />;
      default:
        return <GitCommit className="h-4 w-4 text-slate-400" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'deployment': return 'border-blue-500/40 bg-blue-500/10';
      case 'config': return 'border-purple-500/40 bg-purple-500/10';
      case 'alert': return 'border-amber-500/40 bg-amber-500/10';
      case 'incident': return 'border-rose-500/40 bg-rose-500/10';
      case 'investigation': return 'border-cyan-500/40 bg-cyan-500/10';
      case 'resolution': return 'border-emerald-500/40 bg-emerald-500/10';
      case 'memory': return 'border-indigo-500/40 bg-indigo-500/10';
      default: return 'border-slate-700 bg-slate-800';
    }
  };

  return (
    <div className="relative border-l-2 border-slate-800 pl-6 space-y-6 my-4">
      {events.map((evt, idx) => (
        <div key={idx} className="relative group">
          {/* Node Icon on Timeline Line */}
          <div className={`absolute -left-[35px] top-0.5 flex h-7 w-7 items-center justify-center rounded-full border shadow-md ${getBorderColor(evt.event_type)}`}>
            {getIcon(evt.event_type)}
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3.5 transition-all hover:border-slate-700">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400 mb-1">
              <span className="font-bold text-slate-200">{evt.timestamp}</span>
              <span className="uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                {evt.event_type}
              </span>
            </div>

            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              {evt.title}
              {evt.service && (
                <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-900">
                  {evt.service}
                </span>
              )}
            </h4>

            <p className="mt-1 text-xs text-slate-300 leading-relaxed font-sans">
              {evt.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
