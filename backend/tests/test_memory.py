import pytest
from app.memory.memory_formatter import MemoryFormatter
from app.memory.memory_queries import MemoryQueryBuilder
from app.memory.memory_service import memory_service

def test_memory_formatter_deployment():
    formatted = MemoryFormatter.format_deployment(
        service_name="payment-service",
        version="2.8.1",
        author="Maya Chen",
        timestamp="2026-09-29 14:00",
        change_summary="Redis pool size adjustment",
        config_changes={"PAYMENT_REDIS_POOL_SIZE": "20"}
    )
    assert "payment-service" in formatted
    assert "Maya Chen" in formatted
    assert "PAYMENT_REDIS_POOL_SIZE=20" in formatted

def test_memory_formatter_resolution():
    formatted = MemoryFormatter.format_resolution(
        incident_id="INC-1042",
        service_name="checkout-api",
        root_cause="Redis pool exhaustion",
        successful_fix="Increased pool size 20 to 50",
        failed_attempts=["Restarted checkout-api 3 times"]
    )
    assert "INC-1042" in formatted
    assert "Redis pool exhaustion" in formatted
    assert "Restarted checkout-api 3 times" in formatted

def test_memory_query_builder():
    query = MemoryQueryBuilder.build_incident_investigation_query(
        service_name="checkout-api",
        symptoms=["Redis timeout", "5xx spike"],
        config_changes={"POOL_SIZE": "20"}
    )
    assert "checkout-api" in query
    assert "Redis timeout" in query
    assert "POOL_SIZE=20" in query

def test_memory_service_local_store():
    mem_id = memory_service.remember_event(
        content="Test operational memory unit",
        source_type="test",
        metadata={"service": "checkout-api"}
    )
    assert mem_id.startswith("MEM-")
    stats = memory_service.get_stats()
    assert stats["total_memories"] > 0
