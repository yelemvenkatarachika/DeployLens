import {
  Incident,
  Deployment,
  InvestigationResult,
  MemoryStats,
  MemoryItem,
  RecurringPattern,
  Service
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error [${res.status}]: ${errorText || res.statusText}`);
  }

  return res.json();
}

export async function getHealth() {
  return fetchJson<{ backend: string; database: string; hindsight: string; llm: string }>(
    `${API_BASE_URL}/health`
  );
}

export async function getDashboardData() {
  return fetchJson<{
    metrics: {
      active_incidents: number;
      deployments_today: number;
      remembered_incidents: number;
      recurring_patterns: number;
    };
    active_incidents_list: any[];
    recent_deployments: any[];
    hindsight_status: string;
  }>(`${API_BASE_URL}/dashboard`);
}

export async function getIncidents(): Promise<Incident[]> {
  return fetchJson<Incident[]>(`${API_BASE_URL}/incidents`);
}

export async function getIncidentDetail(id: string): Promise<Incident> {
  return fetchJson<Incident>(`${API_BASE_URL}/incidents/${id}`);
}

export async function investigateIncident(id: string): Promise<InvestigationResult> {
  return fetchJson<InvestigationResult>(`${API_BASE_URL}/incidents/${id}/investigate`, {
    method: 'POST'
  });
}

export async function recallSimilarIncidents(id: string): Promise<{
  incident_id: string;
  total_matches: number;
  similar_incidents: any[];
  hindsight_memories_used: number;
  hindsight_status: string;
}> {
  return fetchJson(`${API_BASE_URL}/incidents/${id}/recall`, {
    method: 'POST'
  });
}

export async function resolveIncident(
  id: string,
  data: {
    confirmed_root_cause: string;
    successful_resolution: string;
    failed_attempts: string[];
    lessons_learned: string;
    prevention_action?: string;
  }
) {
  return fetchJson<{
    status: string;
    message: string;
    hindsight_memory_id: string;
    learned_memory: string;
  }>(`${API_BASE_URL}/incidents/${id}/resolve`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function getDeployments(): Promise<Deployment[]> {
  return fetchJson<Deployment[]>(`${API_BASE_URL}/deployments`);
}

export async function getMemorySearch(q: string = '') {
  return fetchJson<{
    query: string;
    total_found: number;
    memories: MemoryItem[];
    hindsight_status: string;
  }>(`${API_BASE_URL}/memory/search?q=${encodeURIComponent(q)}`);
}

export async function getMemoryStats(): Promise<MemoryStats> {
  return fetchJson<MemoryStats>(`${API_BASE_URL}/memory/stats`);
}

export async function getPatterns(): Promise<RecurringPattern[]> {
  return fetchJson<RecurringPattern[]>(`${API_BASE_URL}/patterns`);
}

export async function askDeployLens(query: string) {
  return fetchJson<{
    query: string;
    answer: string;
    sources: MemoryItem[];
    hindsight_status: string;
  }>(`${API_BASE_URL}/ask`, {
    method: 'POST',
    body: JSON.stringify({ query })
  });
}
