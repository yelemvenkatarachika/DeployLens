'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  BrainCircuit, 
  History, 
  CheckCircle2, 
  Activity, 
  AlertTriangle, 
  Clock, 
  GitCommit, 
  Loader2,
  Database,
  ArrowLeft
} from 'lucide-react';
import { getIncidentDetail } from '@/lib/api';
import { Incident } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import InvestigationView from '@/components/InvestigationView';
import HaveWeSeenThisView from '@/components/HaveWeSeenThisView';
import ResolutionModal from '@/components/ResolutionModal';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function IncidentDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'investigate' | 'recall' | 'overview'>('investigate');
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  const fetchDetail = () => {
    setLoading(true);
    getIncidentDetail(id)
      .then((data) => setIncident(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center space-x-3 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        <span className="text-sm font-mono">Loading incident telemetry...</span>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="py-12 text-center text-slate-400">
        Incident not found. <Link href="/incidents" className="text-indigo-400 underline">Back to incidents</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/incidents" className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 font-mono">
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Incidents Registry</span>
      </Link>

      {/* Incident Header Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div>
            <div className="flex items-center space-x-3">
              <span className="rounded bg-indigo-600/20 px-3 py-1 text-sm font-bold font-mono text-indigo-300 border border-indigo-500/30">
                {incident.incident_id}
              </span>
              <StatusBadge type="severity" value={incident.severity} />
              <StatusBadge type="status" value={incident.status} />
            </div>

            <h1 className="mt-3 text-2xl font-extrabold text-white tracking-tight">
              {incident.title}
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Affected Service: <strong className="text-slate-200 font-mono">{incident.service_name}</strong> | Environment: <span className="font-mono text-slate-300">production</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('investigate')}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-semibold shadow-md transition-all ${
                activeTab === 'investigate'
                  ? 'bg-indigo-600 text-white shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <BrainCircuit className="h-4 w-4" />
              <span>Investigate Incident</span>
            </button>

            <button
              onClick={() => setActiveTab('recall')}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-semibold shadow-md transition-all ${
                activeTab === 'recall'
                  ? 'bg-purple-600 text-white shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <History className="h-4 w-4" />
              <span>Have We Seen This Before?</span>
            </button>

            {incident.status !== 'RESOLVED' && (
              <button
                onClick={() => setIsResolveModalOpen(true)}
                className="flex items-center space-x-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Resolve Incident</span>
              </button>
            )}
          </div>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
            <span className="text-slate-500 block">HTTP Error Rate</span>
            <span className="text-lg font-bold text-rose-400">{incident.error_rate}%</span>
          </div>

          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
            <span className="text-slate-500 block">p99 Latency</span>
            <span className="text-lg font-bold text-amber-400">{incident.latency_ms} ms</span>
          </div>

          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
            <span className="text-slate-500 block">Correlated Deployment</span>
            <span className="text-sm font-bold text-purple-300">payment-service v2.8.1</span>
          </div>

          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
            <span className="text-slate-500 block">Hindsight Status</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <Database className="h-3 w-3" />
              Memory Connected
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-800 space-x-4 font-mono text-xs">
        <button
          onClick={() => setActiveTab('investigate')}
          className={`pb-3 font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'investigate'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BrainCircuit className="h-4 w-4" />
          AI Investigation Report
        </button>

        <button
          onClick={() => setActiveTab('recall')}
          className={`pb-3 font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'recall'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="h-4 w-4" />
          Have We Seen This Before?
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="h-4 w-4" />
          Telemetry & Alerts
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'investigate' && (
        <InvestigationView incidentId={incident.incident_id} />
      )}

      {activeTab === 'recall' && (
        <HaveWeSeenThisView incidentId={incident.incident_id} />
      )}

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Alerts Breakdown */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 font-semibold">
              Triggered System Alerts ({incident.alerts?.length || 0})
            </h3>
            <div className="space-y-3">
              {incident.alerts?.map((alert) => (
                <div key={alert.id} className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-rose-400 font-bold">{alert.alert_type}</span>
                    <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-200 text-sm font-sans">{alert.message}</p>
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center space-x-3">
                    <span>Metric: {alert.metric}</span>
                    <span>Prev: {alert.previous_value}</span>
                    <span className="text-amber-400">Curr: {alert.current_value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resolution Modal */}
      <ResolutionModal
        incidentId={incident.incident_id}
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        onResolved={() => {
          setIsResolveModalOpen(false);
          fetchDetail();
        }}
      />
    </div>
  );
}
