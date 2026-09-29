from typing import Dict, Any, List, Optional
import datetime

class MemoryFormatter:
    """
    Converts raw operational events (Deployments, Incidents, Actions, Postmortems)
    into rich semantic memories formatted for Hindsight long-term store.
    """

    @staticmethod
    def format_deployment(
        service_name: str,
        version: str,
        author: str,
        timestamp: str,
        change_summary: str,
        config_changes: Optional[Dict[str, Any]] = None,
        dependency_changes: Optional[Dict[str, Any]] = None,
        database_migration: bool = False
    ) -> str:
        config_str = ""
        if config_changes:
            config_items = [f"{k}={v}" for k, v in config_changes.items()]
            config_str = f" Configuration changes introduced: {', '.join(config_items)}."

        dep_str = ""
        if dependency_changes:
            dep_str = f" Dependency updates: {dependency_changes}."

        migration_str = " Includes database schema migration." if database_migration else ""

        return (
            f"On {timestamp}, {service_name} version {version} was deployed to production by {author}. "
            f"Change Summary: {change_summary}.{config_str}{dep_str}{migration_str}"
        )

    @staticmethod
    def format_incident(
        incident_id: str,
        service_name: str,
        timestamp: str,
        severity: str,
        title: str,
        symptoms: List[str],
        error_rate: float,
        latency_ms: float
    ) -> str:
        symptom_str = ", ".join(symptoms) if symptoms else "Unusual latency and HTTP 5xx errors"
        return (
            f"[{incident_id}] affected {service_name} ({severity}) on {timestamp}. "
            f"Incident title: '{title}'. Checkout latency reached {latency_ms}ms and HTTP 5xx error rate reached {error_rate}%. "
            f"Observed symptoms: {symptom_str}."
        )

    @staticmethod
    def format_investigation(
        incident_id: str,
        service_name: str,
        engineer: str,
        action: str,
        result: str,
        outcome_type: str
    ) -> str:
        if outcome_type in ("FAILED_TEMPORARY", "FAILED_NO_EFFECT"):
            return (
                f"During [{incident_id}] on {service_name}, engineer {engineer} attempted action: '{action}'. "
                f"Result: {result}. Outcome: This action WAS NOT a permanent fix ({outcome_type})."
            )
        else:
            return (
                f"During [{incident_id}] on {service_name}, engineer {engineer} performed action: '{action}'. "
                f"Result: {result}. Outcome: {outcome_type}."
            )

    @staticmethod
    def format_resolution(
        incident_id: str,
        service_name: str,
        root_cause: str,
        successful_fix: str,
        failed_attempts: List[str],
        recovery_time_min: int = 10
    ) -> str:
        failed_str = f" Previously attempted fixes that failed: {'; '.join(failed_attempts)}." if failed_attempts else ""
        return (
            f"[{incident_id}] on {service_name} was resolved. "
            f"Root Cause: {root_cause}. Successful Fix: {successful_fix}.{failed_str} "
            f"System metrics recovered within {recovery_time_min} minutes after fix application."
        )

    @staticmethod
    def format_lesson(
        service_name: str,
        pattern: str,
        recommendation: str,
        failed_approach: str
    ) -> str:
        return (
            f"Operational Lesson for {service_name}: When encountering {pattern}, "
            f"the recommended verified action is '{recommendation}'. "
            f"Avoid '{failed_approach}' as it has historically failed to provide permanent resolution."
        )
