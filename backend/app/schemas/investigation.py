from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class TimelineEvent(BaseModel):
    timestamp: str
    event_type: str # deployment, config, alert, incident, investigation, resolution, memory
    title: str
    detail: str
    service: Optional[str] = None
    severity: Optional[str] = None

class SimilarIncident(BaseModel):
    incident_id: str
    title: str
    similarity_score: float # e.g. 0.91 for 91%
    similarity_percentage: str # e.g. "91%"
    symptoms: List[str]
    root_cause: str
    previous_successful_fix: str
    previous_failed_attempts: List[str] = Field(default_factory=list)

class HistoricalPattern(BaseModel):
    pattern_name: str
    occurrences: int
    associated_service: str
    symptoms: List[str]
    successful_resolution: str
    failed_resolution: str

class EvidenceItem(BaseModel):
    id: str # e.g. MEM-0012, DEP-1837, INC-1042
    evidence_type: str # fact, historical_memory, metric, deployment
    title: str
    description: str
    relevance: str

class InvestigationResult(BaseModel):
    incident_id: str
    incident_title: str
    affected_service: str
    incident_summary: str
    suspected_change: Dict[str, Any] = Field(default_factory=dict)
    timeline: List[TimelineEvent] = Field(default_factory=list)
    similar_incidents: List[SimilarIncident] = Field(default_factory=list)
    historical_patterns: List[HistoricalPattern] = Field(default_factory=list)
    previous_successful_actions: List[str] = Field(default_factory=list)
    previous_failed_actions: List[str] = Field(default_factory=list)
    recommended_checks: List[str] = Field(default_factory=list)
    confidence: float # numeric score e.g. 92.5 or 0.92
    confidence_level: str # High, Medium, Low
    confidence_explanation: str
    evidence: List[EvidenceItem] = Field(default_factory=list)
    hindsight_used: bool = True
    hindsight_status: str = "Connected"
