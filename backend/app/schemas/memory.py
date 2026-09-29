from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class MemoryItem(BaseModel):
    id: str
    content: str
    source_type: str # deployment, incident, investigation, resolution, postmortem, failure, learning
    service: Optional[str] = None
    incident_id: Optional[str] = None
    deployment_id: Optional[str] = None
    timestamp: Optional[str] = None
    severity: Optional[str] = None
    outcome: Optional[str] = None
    similarity_score: Optional[float] = None
    metadata: Dict[str, Any] = {}

class MemorySearchResponse(BaseModel):
    query: str
    total_found: int
    memories: List[MemoryItem]
    hindsight_status: str

class MemoryStatsResponse(BaseModel):
    total_memories: int
    deployments_remembered: int
    incidents_remembered: int
    resolutions_remembered: int
    failed_approaches_remembered: int
    learned_patterns: int
    memory_growth: List[Dict[str, Any]] # e.g. [{"day": "Day 1", "count": 12}, ...]
    hindsight_status: str
