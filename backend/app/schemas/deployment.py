from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class DeploymentSchema(BaseModel):
    id: int
    deployment_id: str
    service_id: int
    service_name: Optional[str] = None
    version: str
    commit_sha: str
    author: str
    timestamp: datetime
    environment: str
    status: str
    change_summary: str
    files_changed: Optional[List[str]] = None
    config_changes: Optional[Dict[str, Any]] = None
    dependency_changes: Optional[Dict[str, Any]] = None
    database_migration: bool
    rollback_of: Optional[str] = None

    class Config:
        from_attributes = True
