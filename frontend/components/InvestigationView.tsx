'use client';

import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Loader2, 
  GitCommit, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';
import { InvestigationResult } from '@/types';
import { investigateIncident } from '@/lib/api';
import FailedFixCard from './FailedFixCard';
import TimelineView from './TimelineView';

interface InvestigationViewProps {
  incidentId: string;
}

export default function InvestigationView({ incidentId }: InvestigationViewProps) {
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<string>('');
  const [report, setReport] = useState<InvestigationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runInvestigation = async () => {
    setLoading(true);
    setError(null);

    const stages = [
      'Analyzing incident metrics & alerts...',
      'Correlating recent deployment timelines...',
      'Searching Hindsight operational memory bank...',
      'Comparing current symptoms with historical incidents...',
      'Evaluating previous resolutions & failed fixes...',
      'Building evidence-backed investigation report...'
    ];

    for (let i = 0; i < stages.length; i++) {
      setStage(stages[i]);
      await new Promise((r) => setTimeout(r, 450));
    }

    try {
      const res = await investigateIncident(incidentId);
      setReport(res);
    } catch (e: any) {
      setError(e.message || 'Investigation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <BrainCircuit className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">DeployLens AI Change Investigator</h3>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Correlates production alerts with recent deployment commits, config changes, and Hindsight organizational memories.
          </p>
        </div>

        <button
          onClick={runInvestigation}
          disabled={loading}
          className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Investigating...</span>
            </>
          ) : (
            <>
              <BrainCircuit className="h-4 w-4" />
              <span>Investigate Incident</span>
            </>
          )}
        </button>
      </div>

      {/* Loading Progress Stages */}
      {loading && (
        <div className="rounded-xl border border-indigo-500/30 bg-slate-950 p-8 text-center space-y-4 shadow-xl">
          <Loader2 className="h-9 w-9 animate-spin text-indigo-400 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-200">{stage}</h4>
            <p className="text-xs font-mono text-indigo-400">Hindsight Memory Bank: novacart-production-memory</p>
          </div>
          <div className="mx-auto max-w-md bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div className="bg-indigo-500 h-full animate-pulse w-3/4 rounded-full" />
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Investigation Report Display */}
      {report && !loading && (
        <div className="space-y-6">
          {/* Header Summary & Confidence */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-900/80 p-5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-2 font-semibold">
                Incident Summary
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {report.incident_summary}
              </p>
            </div>

            {/* Confidence Gauge */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                    Investigation Confidence
                  </span>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-white">{report.confidence}%</span>
                  <span className="text-xs font-semibold text-emerald-300">({report.confidence_level})</span>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-slate-300 leading-normal border-t border-emerald-900/40 pt-2 font-mono">
                {report.confidence_explanation}
              </p>
            </div>
          </div>

          {/* Most Suspicious Change Card */}
          {report.suspected_change?.deployment_id && (
            <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-5">
              <div className="flex items-center justify-between border-b border-purple-900/40 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <GitCommit className="h-5 w-5 text-purple-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Most Suspicious Deployment Change
                  </h4>
                </div>
                <span className="rounded bg-purple-500/20 px-2.5 py-0.5 text-xs font-mono text-purple-300 border border-purple-500/30">
                  {report.suspected_change.deployment_id}
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-xs font-mono text-slate-300 mb-3">
                <div>
                  <span className="text-slate-500 block">Service:</span>
                  <span className="text-slate-100 font-bold">{report.suspected_change.service}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Version:</span>
                  <span className="text-slate-100 font-bold">{report.suspected_change.version}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Author:</span>
                  <span className="text-slate-100 font-bold">{report.suspected_change.author}</span>
                </div>
              </div>

              <div className="rounded-lg bg-slate-950 p-3.5 border border-purple-900/30 text-xs text-slate-200">
                <strong className="text-purple-300 block mb-1">Why It Matters:</strong>
                {report.suspected_change.reason}
              </div>
            </div>
          )}

          {/* What Worked vs What Failed */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* What Worked Before */}
            <div className="rounded-xl border border-emerald-500/30 bg-slate-900/80 p-5">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm mb-3">
                <CheckCircle2 className="h-4 w-4" />
                <span>What Worked Before (Hindsight Memory)</span>
              </div>
              <ul className="space-y-2">
                {report.previous_successful_actions?.map((act, i) => (
                  <li key={i} className="text-xs text-slate-200 bg-emerald-950/20 p-2.5 rounded border border-emerald-900/40 leading-relaxed font-sans">
                    ✓ {act}
                  </li>
                ))}
              </ul>
            </div>

            {/* What Failed Before */}
            <FailedFixCard failedActions={report.previous_failed_actions} />
          </div>

          {/* Recommended Investigation Checks */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-3 font-semibold flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              Recommended Next Investigation Steps
            </h4>
            <div className="space-y-2">
              {report.recommended_checks?.map((check, idx) => (
                <div key={idx} className="flex items-start space-x-3 rounded-lg bg-slate-950 p-3 border border-slate-800 text-xs text-slate-200">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span className="leading-normal">{check}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Drawer */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 font-semibold flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-indigo-400" />
              Evidence-First Reasoning Ledger
            </h4>
            <div className="grid gap-3">
              {report.evidence?.map((item, idx) => (
                <div key={idx} className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="rounded font-mono px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.id}
                    </span>
                    <span className="font-semibold text-slate-200">{item.title}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{item.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline View */}
          {report.timeline?.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-4 font-semibold">
                Correlated Incident & Memory Timeline
              </h4>
              <TimelineView events={report.timeline} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
