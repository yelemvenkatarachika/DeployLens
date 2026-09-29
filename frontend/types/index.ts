export interface Service {
  id: number;
  name: string;
  description?: string;
  owner_team: string;
  environment: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Deployment {
  id: number;
  deployment_id: string;
  service_id: number;
  service_name?: string;
  version: string;
  commit_sha: string;
  author: string;
  timestamp: string;
  environment: string;
  status: 'SUCCESS' | 'FAILED' | 'ROLLED_BACK';
  change_summary: string;
  files_changed?: string[];
  config_changes?: Record<string, any>;
  dependency_changes?: Record<string, any>;
  database_migration: boolean;
  rollback_of?: string;
}

export interface Alert {
  id: number;
  timestamp: string;
  alert_type: string;
  metric: string;
  previous_value: string;
  current_value: string;
  message: string;
}

export interface InvestigationAction {
  id: number;
  timestamp: string;
  engineer: string;
  action: string;
  result: string;
  outcome_type: 'SUCCESS' | 'FAILED_TEMPORARY' | 'FAILED_NO_EFFECT' | 'INCONCLUSIVE';
}

export interface Postmortem {
  summary: string;
  root_cause: string;
  successful_fix: string;
  failed_attempts?: string[];
  lessons_learned: string;
}

export interface Incident {
  id: number;
  incident_id: string;
  title: string;
  description: string;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3';
  service_id: number;
  service_name?: string;
  started_at: string;
  detected_at: string;
  resolved_at?: string;
  status: 'ACTIVE' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED';
  error_rate: number;
  latency_ms: number;
  symptoms?: string[];
  root_cause?: string;
  resolution?: string;
  alerts?: Alert[];
  actions?: InvestigationAction[];
  postmortem?: Postmortem;
}

export interface TimelineEvent {
  timestamp: string;
  event_type: 'deployment' | 'config' | 'alert' | 'incident' | 'investigation' | 'resolution' | 'memory';
  title: string;
  detail: string;
  service?: string;
  severity?: string;
}

export interface SimilarIncident {
  incident_id: string;
  title: string;
  similarity_score: number;
  similarity_percentage: string;
  symptoms: string[];
  root_cause: string;
  previous_successful_fix: string;
  previous_failed_attempts: string[];
}

export interface HistoricalPattern {
  pattern_name: string;
  occurrences: number;
  associated_service: string;
  symptoms: string[];
  successful_resolution: string;
  failed_resolution: string;
}

export interface EvidenceItem {
  id: string;
  evidence_type: 'fact' | 'historical_memory' | 'metric' | 'deployment';
  title: string;
  description: string;
  relevance: string;
}

export interface InvestigationResult {
  incident_id: string;
  incident_title: string;
  affected_service: string;
  incident_summary: string;
  suspected_change: {
    deployment_id?: string;
    service?: string;
    version?: string;
    author?: string;
    reason?: string;
  };
  timeline: TimelineEvent[];
  similar_incidents: SimilarIncident[];
  historical_patterns: HistoricalPattern[];
  previous_successful_actions: string[];
  previous_failed_actions: string[];
  recommended_checks: string[];
  confidence: number;
  confidence_level: 'High' | 'Medium' | 'Low';
  confidence_explanation: string;
  evidence: EvidenceItem[];
  hindsight_used: boolean;
  hindsight_status: string;
}

export interface MemoryItem {
  id: string;
  content: string;
  source_type: string;
  service?: string;
  similarity_score?: number;
  metadata?: Record<string, any>;
}

export interface MemoryStats {
  total_memories: number;
  deployments_remembered: number;
  incidents_remembered: number;
  resolutions_remembered: number;
  failed_approaches_remembered: number;
  learned_patterns: number;
  memory_growth: { day: string; count: number }[];
  hindsight_status: string;
}

export interface RecurringPattern {
  id: string;
  name: string;
  observed_count: number;
  associated_service: string;
  trigger_condition: string;
  symptoms: string[];
  successful_historical_fix: string;
  failed_historical_fix: string;
  confidence: string;
}
