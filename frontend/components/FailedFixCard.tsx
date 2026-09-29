'use client';

import React from 'react';
import { AlertOctagon, RotateCcw, XCircle, Info } from 'lucide-react';

interface FailedFixCardProps {
  failedActions: string[];
}

export default function FailedFixCard({ failedActions }: FailedFixCardProps) {
  if (!failedActions || failedActions.length === 0) return null;

  return (
    <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-5 backdrop-blur-sm">
      <div className="flex items-center space-x-2 text-rose-400 font-semibold text-sm mb-3">
        <AlertOctagon className="h-5 w-5 text-rose-500" />
        <span className="tracking-wide uppercase text-xs font-mono">Historical Failed Fix Memory</span>
      </div>

      <div className="space-y-3">
        {failedActions.map((actionText, idx) => (
          <div key={idx} className="rounded-lg border border-rose-900/40 bg-slate-950/80 p-3.5">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 rounded-full bg-rose-500/20 p-1 text-rose-400 border border-rose-500/30">
                <XCircle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                  <span className="text-rose-300 font-semibold">Previously Attempted Action</span>
                  <span className="rounded bg-rose-500/10 px-2 py-0.5 text-rose-400 border border-rose-500/20">
                    0/3 Permanent Resolutions
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-200">
                  {actionText}
                </p>
                <div className="mt-2.5 flex items-center space-x-1.5 rounded bg-slate-900 px-2.5 py-1 text-xs text-amber-300 border border-slate-800">
                  <Info className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>
                    DeployLens Memory Warning: This action historically provided temporary relief (5-8 mins) but did NOT permanently resolve the root cause.
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
