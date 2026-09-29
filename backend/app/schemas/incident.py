from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel

class ServiceSchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    owner_team: str
    environment: str
    criticality: str

    class Config:
        from_attributes = True

class AlertSchema(BaseModel):
    id: int
    incident_id: Optional[int] = None
    service_id: int
    timestamp: datetime
    alert_type: str
    metric: str
    previous_value: str
    current_value: str
    message: str

    class Config:
        from_attributes = True

class InvestigationActionSchema(BaseModel):
    id: int
    incident_id: int
    timestamp: datetime
    engineer: str
    action: str
    result: str
    outcome_type: str

    class Config:
        from_attributes = True

class PostmortemSchema(BaseModel):
    id: int
    incident_id: int
    summary: str
    root_cause: str
    contributing_factors: Optional[List[str]] = None
    successful_fix: str
    failed_attempts: Optional[List[str]] = None
    prevention_actions: Optional[List[str]] = None
    lessons_learned: str
    created_at: datetime

    class Config:
        from_attributes = True

class IncidentSchema(BaseModel):
    id: int
    incident_id: str
    title: str
    description: str
    severity: str
    service_id: int
    service_name: Optional[str] = None
    started_at: datetime
    detected_at: datetime
    resolved_at: Optional[datetime] = None
    status: str
    error_rate: float
    latency_ms: float
    symptoms: Optional[List[str]] = None
    root_cause: Optional[str] = None
    resolution: Optional[str] = None

    alerts: List[AlertSchema] = []
    actions: List[InvestigationActionSchema] = []
    postmortem: Optional[PostmortemSchema] = None

    class Config:
        from_attributes = True

class IncidentResolveRequest(BaseModel):
    confirmed_root_cause: str
    successful_resolution: str
    failed_attempts: List[str] = []
    lessons_learned: str
    prevention_action: Optional[str] = None
    engineer_name: Optional[str] = "Maya Chen"
