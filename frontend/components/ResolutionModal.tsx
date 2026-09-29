'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  BrainCircuit, 
  Loader2, 
  Sparkles, 
  Database 
} from 'lucide-react';
import { resolveIncident } from '@/lib/api';

interface ResolutionModalProps {
  incidentId: string;
  isOpen: boolean;
  onClose: () => void;
  onResolved: () => void;
}

export default function ResolutionModal({
  incidentId,
  isOpen,
  onClose,
  onResolved
}: ResolutionModalProps) {
  const [loading, setLoading] = useState(false);
  const [rootCause, setRootCause] = useState('payment-service Redis connection pool size restricted to 20 connections.');
  const [fix, setFix] = useState('Increased PAYMENT_REDIS_POOL_SIZE environment variable from 20 to 50.');
  const [failed, setFailed] = useState('Restart checkout-api (attempted 3 times; provided temporary relief only).');
  const [lesson, setLesson] = useState('For checkout incidents involving Redis timeouts after payment releases, verify pool sizing before restarting services.');
  const [prevention, setPrevention] = useState('Enforce minimum Redis pool size check in CI/CD release pipeline.');
  const [successResult, setSuccessResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await resolveIncident(incidentId, {
        confirmed_root_cause: rootCause,
        successful_resolution: fix,
        failed_attempts: failed ? [failed] : [],
        lessons_learned: lesson,
        prevention_action: prevention
      });
      setSuccessResult(res);
      setTimeout(() => {
        onResolved();
      }, 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to resolve incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2 border-b border-slate-800 pb-4 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Resolve Incident {incidentId}</h3>
            <p className="text-xs text-slate-400">
              Close incident and write new operational memories to Hindsight long-term store.
            </p>
          </div>
        </div>

        {successResult ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="h-8 w-8 animate-pulse" />
            </div>
            <h4 className="text-lg font-bold text-white">Operational Memory Updated!</h4>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs font-mono text-emerald-300 max-w-lg mx-auto leading-relaxed">
              {successResult.learned_memory}
            </div>
            <p className="text-xs text-slate-400">
              Memory ID: <span className="font-mono text-indigo-400">{successResult.hindsight_memory_id}</span> stored in bank <span className="font-mono text-slate-300">novacart-production-memory</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Confirmed Root Cause</label>
              <textarea
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                required
                rows={2}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-emerald-400 font-semibold mb-1">Successful Resolution Fix</label>
              <textarea
                value={fix}
                onChange={(e) => setFix(e.target.value)}
                required
                rows={2}
                className="w-full rounded-lg border border-emerald-900/50 bg-slate-950 p-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-rose-400 font-semibold mb-1">Failed Fix Attempts (Will be remembered as anti-patterns)</label>
              <input
                type="text"
                value={failed}
                onChange={(e) => setFailed(e.target.value)}
                className="w-full rounded-lg border border-rose-900/50 bg-slate-950 p-2.5 text-slate-200 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Operational Lesson Learned</label>
                <input
                  type="text"
                  value={lesson}
                  onChange={(e) => setLesson(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Prevention Action Item</label>
                <input
                  type="text"
                  value={prevention}
                  onChange={(e) => setPrevention(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-800 px-4 py-2 text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 rounded-lg bg-emerald-600 px-5 py-2 text-white font-semibold hover:bg-emerald-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Writing Hindsight Memory...</span>
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4" />
                    <span>Resolve & Save Operational Memory</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
