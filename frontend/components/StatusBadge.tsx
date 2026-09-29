'use client';

import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  type: 'severity' | 'status' | 'hindsight' | 'confidence';
  value: string;
}

export default function StatusBadge({ type, value }: StatusBadgeProps) {
  if (type === 'severity') {
    const isSev1 = value === 'SEV-1';
    const isSev2 = value === 'SEV-2';
    return (
      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
        isSev1
          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
          : isSev2
          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
          : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
      }`}>
        <AlertTriangle className="h-3 w-3" />
        {value}
      </span>
    );
  }

  if (type === 'status') {
    const isActive = value === 'ACTIVE' || value === 'INVESTIGATING';
    return (
      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
        isActive
          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      }`}>
        {isActive ? <Clock className="h-3 w-3 animate-pulse" /> : <CheckCircle className="h-3 w-3" />}
        {value}
      </span>
    );
  }

  if (type === 'confidence') {
    const isHigh = value === 'High' || parseFloat(value) >= 85;
    const isMed = value === 'Medium' || (parseFloat(value) >= 70 && parseFloat(value) < 85);
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isHigh
          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
          : isMed
          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
          : 'bg-slate-500/15 text-slate-300 border border-slate-500/30'
      }`}>
        <ShieldCheck className="h-3.5 w-3.5" />
        Confidence: {value}
      </span>
    );
  }

  // hindsight
  return (
    <span className="inline-flex items-center gap-1 rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-300">
      Hindsight Memory
    </span>
  );
}
