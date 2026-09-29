'use client';

import React from 'react';
import { 
  Columns, 
  HelpCircle, 
  BrainCircuit, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';

export default function BeforeAfterComparison() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-indigo-500/30 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Columns className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Before vs After Memory Comparison</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Demonstrating the fundamental difference between standard stateless AI vs Hindsight persistent organizational memory.
            </p>
          </div>
        </div>
      </div>

      {/* Side by Side Comparison Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* WITHOUT MEMORY */}
        <div className="rounded-xl border border-amber-500/30 bg-slate-900/80 p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 rounded-bl-xl bg-amber-500/20 px-3 py-1 text-xs font-mono font-bold text-amber-300 border-b border-l border-amber-500/30">
            Generic AI Chatbot (No Memory)
          </div>

          <div className="flex items-center space-x-2 text-amber-400 font-bold text-base mb-4">
            <HelpCircle className="h-5 w-5" />
            <span>WITHOUT ORGANIZATIONAL MEMORY</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Input Context */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <span className="text-slate-400 font-mono uppercase tracking-wider block mb-1">
                Current Isolated Evidence:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono">
                <li>checkout-api error rate spike (18.4%)</li>
                <li>Redis connection timeout warning</li>
                <li>Recent payment-service deployment</li>
              </ul>
            </div>

            {/* AI Output */}
            <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-4 space-y-2">
              <span className="text-amber-300 font-bold font-mono block">
                Generic AI Output (Stateless RAG / Chatbot):
              </span>
              <p className="text-slate-300 leading-relaxed font-sans">
                "Based on the error logs, here are general troubleshooting steps for Redis connection issues:"
              </p>
              <ul className="space-y-1.5 pt-2 text-slate-300">
                <li className="flex items-center space-x-2">
                  <span className="text-amber-400 font-mono font-bold">1.</span>
                  <span>Check if the Redis cluster is online and reachable over the network.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-amber-400 font-mono font-bold">2.</span>
                  <span>Inspect general application logs for stack traces.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-amber-400 font-mono font-bold">3.</span>
                  <span>Restart checkout-api pods to refresh connection states.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-amber-400 font-mono font-bold">4.</span>
                  <span>Check network security groups and firewall rules.</span>
                </li>
              </ul>
            </div>

            {/* Verdict */}
            <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 text-rose-300 font-mono text-[11px] leading-relaxed">
              ✖ <strong>Limitation:</strong> Recommends generic service restart. Has NO awareness that restarting checkout-api failed 3 times historically!
            </div>
          </div>
        </div>

        {/* WITH HINDSIGHT MEMORY */}
        <div className="rounded-xl border border-indigo-500/40 bg-slate-900/90 p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 rounded-bl-xl bg-indigo-600 px-3 py-1 text-xs font-mono font-bold text-white border-b border-l border-indigo-400 shadow-md">
            DeployLens + Hindsight
          </div>

          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-base mb-4">
            <BrainCircuit className="h-5 w-5" />
            <span>WITH HINDSIGHT PERSISTENT MEMORY</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Memory Recall Context */}
            <div className="rounded-lg border border-indigo-900/50 bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between font-mono text-indigo-300">
                <span className="font-bold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Hindsight Recall Results:
                </span>
                <span className="text-[11px] bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                  3 Matches Found
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-[11px]">
                <li>INC-1042 (91% Match): Identical Redis pool exhaustion after payment deploy</li>
                <li>Historical Failed Fix: Restarting checkout-api provided 8 mins temporary relief only</li>
                <li>Historical Verified Fix: Increasing PAYMENT_REDIS_POOL_SIZE 20 → 50 fixed it in 6 mins</li>
              </ul>
            </div>

            {/* DeployLens Intelligence */}
            <div className="rounded-lg border border-indigo-500/40 bg-indigo-950/30 p-4 space-y-3">
              <span className="text-indigo-300 font-bold font-mono block text-sm flex items-center justify-between">
                DeployLens Evidence-Backed Report:
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  94% Confidence
                </span>
              </span>

              <div className="space-y-2">
                <div className="rounded bg-rose-950/40 p-2.5 border border-rose-900/50 text-rose-300 font-mono text-[11px]">
                  <strong className="block text-rose-200">⚠ FAILED FIX WARNING:</strong>
                  Do NOT rely on restarting checkout-api. Restarting was attempted 3 times historically and provided temporary recovery only before errors returned.
                </div>

                <div className="rounded bg-emerald-950/40 p-2.5 border border-emerald-900/50 text-emerald-300 font-mono text-[11px]">
                  <strong className="block text-emerald-200">✓ RECOMMENDED FIRST ACTION:</strong>
                  Inspect payment-service deployment DEP-1837 and increase PAYMENT_REDIS_POOL_SIZE from 20 to 50 in environment settings.
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div className="rounded-lg bg-slate-950 p-3.5 border border-indigo-900/50 text-emerald-300 font-mono text-[11px] leading-relaxed">
              ✔ <strong>Value of Hindsight:</strong> Learns from historical outcomes, prevents repeated troubleshooting mistakes, and delivers instant time-to-resolution!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
