from typing import List, Optional

class MemoryQueryBuilder:
    """
    Constructs semantic queries for Hindsight vector search based on incident context.
    """

    @staticmethod
    def build_incident_investigation_query(
        service_name: str,
        symptoms: List[str],
        config_changes: Optional[dict] = None,
        alerts: Optional[List[str]] = None
    ) -> str:
        symptom_str = " ".join(symptoms) if symptoms else "latency error rate spike timeout"
        config_str = ""
        if config_changes:
            config_str = " " + " ".join([f"{k}={v}" for k, v in config_changes.items()])
        alert_str = " " + " ".join(alerts) if alerts else ""

        return (
            f"service {service_name} symptoms {symptom_str}{config_str}{alert_str} "
            f"root cause successful fix failed attempt previous incident"
        )

    @staticmethod
    def build_have_we_seen_this_query(
        service_name: str,
        symptoms: List[str],
        error_messages: Optional[List[str]] = None
    ) -> str:
        sym = ", ".join(symptoms) if symptoms else "outage"
        err = " ".join(error_messages) if error_messages else ""
        return f"{service_name} historical incident failure {sym} {err} root cause resolution"

    @staticmethod
    def build_failed_fix_query(service_name: str) -> str:
        return f"{service_name} failed attempts temporary fix restarted ineffective workarounds"
