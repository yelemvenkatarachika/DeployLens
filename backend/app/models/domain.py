import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.models.database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    owner_team = Column(String, nullable=False, default="Platform")
    environment = Column(String, nullable=False, default="production")
    criticality = Column(String, nullable=False, default="HIGH") # CRITICAL, HIGH, MEDIUM, LOW
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    deployments = relationship("Deployment", back_populates="service", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="service", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="service", cascade="all, delete-orphan")


class Deployment(Base):
    __tablename__ = "deployments"

    id = Column(Integer, primary_key=True, index=True)
    deployment_id = Column(String, unique=True, index=True, nullable=False) # e.g. DEP-1837
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    version = Column(String, nullable=False)
    commit_sha = Column(String, nullable=False)
    author = Column(String, nullable=False)
    timestamp = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
    environment = Column(String, nullable=False, default="production")
    status = Column(String, nullable=False, default="SUCCESS") # SUCCESS, FAILED, ROLLED_BACK
    change_summary = Column(Text, nullable=False)
    files_changed = Column(JSON, nullable=True) # list of file paths
    config_changes = Column(JSON, nullable=True) # dict of config diffs
    dependency_changes = Column(JSON, nullable=True) # dict or list of dep changes
    database_migration = Column(Boolean, default=False)
    rollback_of = Column(String, nullable=True)

    service = relationship("Service", back_populates="deployments")


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String, unique=True, index=True, nullable=False) # e.g. INC-2051
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String, nullable=False) # SEV-1, SEV-2, SEV-3
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    started_at = Column(DateTime, nullable=False)
    detected_at = Column(DateTime, nullable=False)
    resolved_at = Column(DateTime, nullable=True)
    status = Column(String, nullable=False, default="ACTIVE") # ACTIVE, INVESTIGATING, MITIGATED, RESOLVED
    error_rate = Column(Float, nullable=False, default=0.0) # e.g. 18.4%
    latency_ms = Column(Float, nullable=False, default=0.0) # e.g. 2800ms
    symptoms = Column(JSON, nullable=True) # list of symptom strings
    root_cause = Column(Text, nullable=True)
    resolution = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    service = relationship("Service", back_populates="incidents")
    alerts = relationship("Alert", back_populates="incident", cascade="all, delete-orphan")
    actions = relationship("InvestigationAction", back_populates="incident", cascade="all, delete-orphan")
    postmortem = relationship("Postmortem", back_populates="incident", uselist=False, cascade="all, delete-orphan")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    timestamp = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
    alert_type = Column(String, nullable=False) # CRITICAL_LATENCY, HTTP_5XX_SPIKE, MEMORY_HIGH, REDIS_TIMEOUT
    metric = Column(String, nullable=False)
    previous_value = Column(String, nullable=False)
    current_value = Column(String, nullable=False)
    message = Column(Text, nullable=False)

    incident = relationship("Incident", back_populates="alerts")
    service = relationship("Service", back_populates="alerts")


class InvestigationAction(Base):
    __tablename__ = "investigation_actions"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False)
    timestamp = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
    engineer = Column(String, nullable=False)
    action = Column(Text, nullable=False)
    result = Column(Text, nullable=False)
    outcome_type = Column(String, nullable=False) # SUCCESS, FAILED_TEMPORARY, FAILED_NO_EFFECT, INCONCLUSIVE

    incident = relationship("Incident", back_populates="actions")


class Postmortem(Base):
    __tablename__ = "postmortems"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False, unique=True)
    summary = Column(Text, nullable=False)
    root_cause = Column(Text, nullable=False)
    contributing_factors = Column(JSON, nullable=True) # list of strings
    successful_fix = Column(Text, nullable=False)
    failed_attempts = Column(JSON, nullable=True) # list of strings
    prevention_actions = Column(JSON, nullable=True) # list of strings
    lessons_learned = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    incident = relationship("Incident", back_populates="postmortem")


class MemoryEvent(Base):
    __tablename__ = "memory_events"

    id = Column(Integer, primary_key=True, index=True)
    source_type = Column(String, nullable=False) # deployment, incident, resolution, investigation, postmortem
    source_id = Column(String, nullable=False) # e.g. INC-2051 or DEP-1837
    hindsight_memory_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, nullable=False, default="STORED") # STORED, FAILED, PENDING
