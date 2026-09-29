import sys
import os
import datetime
from typing import List, Dict, Any

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.models.database import engine, Base, SessionLocal
from app.models.domain import Service, Deployment, Incident, Alert, InvestigationAction, Postmortem, MemoryEvent
from app.memory.memory_service import memory_service
from app.memory.hindsight_client import hindsight_client

def seed():
    print("Starting DeployLens NovaCart Demo Data Seeding...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # 1. Create NovaCart Services (10 services)
        print("Creating NovaCart services...")
        services_data = [
            {"name": "checkout-api", "description": "Core checkout and purchase orchestrator API", "owner_team": "Checkout Team", "criticality": "CRITICAL"},
            {"name": "payment-service", "description": "Payment gateway processing & tokenization engine", "owner_team": "Payments Team", "criticality": "CRITICAL"},
            {"name": "order-service", "description": "Order management & fulfillment tracking service", "owner_team": "Fulfillment Team", "criticality": "HIGH"},
            {"name": "inventory-service", "description": "Stock count & warehouse reservation API", "owner_team": "Logistics Team", "criticality": "HIGH"},
            {"name": "auth-service", "description": "User authentication, JWT issuing & permission service", "owner_team": "Security Team", "criticality": "CRITICAL"},
            {"name": "notification-service", "description": "Transactional emails & SMS notification queue", "owner_team": "Growth Team", "criticality": "MEDIUM"},
            {"name": "recommendation-service", "description": "ML recommendation engine for checkout upsells", "owner_team": "Data Science", "criticality": "LOW"},
            {"name": "api-gateway", "description": "Edge routing & rate limiting gateway", "owner_team": "Infrastructure", "criticality": "CRITICAL"},
            {"name": "postgres-primary", "description": "Primary transactional PostgreSQL database cluster", "owner_team": "Database Team", "criticality": "CRITICAL"},
            {"name": "redis-cluster", "description": "Shared Redis cache & connection pool cluster", "owner_team": "Database Team", "criticality": "CRITICAL"}
        ]

        services_dict = {}
        for s in services_data:
            srv = Service(**s)
            db.add(srv)
            db.flush()
            services_dict[s["name"]] = srv

        db.commit()

        # 2. Deployments (25 deployments across services)
        print("Creating deployments...")
        now = datetime.datetime.utcnow()
        deployments_data = [
            # Hero deployment
            {
                "deployment_id": "DEP-1837",
                "service_id": services_dict["payment-service"].id,
                "version": "2.8.1",
                "commit_sha": "a7f93b2",
                "author": "Maya Chen",
                "timestamp": now - datetime.timedelta(minutes=45),
                "status": "SUCCESS",
                "change_summary": "Optimized Redis connection pool allocation and updated client timeout config",
                "files_changed": ["src/redis/pool.py", "config/production.yaml"],
                "config_changes": {"PAYMENT_REDIS_POOL_SIZE": "20", "REDIS_TIMEOUT_MS": "1500"},
                "dependency_changes": {"redis-py": "5.0.1"},
                "database_migration": False
            },
            # Historical deployment matching INC-1042
            {
                "deployment_id": "DEP-0982",
                "service_id": services_dict["payment-service"].id,
                "version": "2.7.4",
                "commit_sha": "e4d101c",
                "author": "Maya Chen",
                "timestamp": now - datetime.timedelta(days=14),
                "status": "SUCCESS",
                "change_summary": "Reduced default pool size to preserve Redis memory overhead",
                "files_changed": ["config/production.yaml"],
                "config_changes": {"PAYMENT_REDIS_POOL_SIZE": "20"},
                "dependency_changes": {},
                "database_migration": False
            },
            # Additional 23 realistic deployments
            {
                "deployment_id": "DEP-1836",
                "service_id": services_dict["postgres-primary"].id,
                "version": "15.4-p2",
                "commit_sha": "c1082ef",
                "author": "Alex Rivera",
                "timestamp": now - datetime.timedelta(minutes=42),
                "status": "SUCCESS",
                "change_summary": "Schema migration: added index on orders.customer_id",
                "files_changed": ["migrations/V14__orders_idx.sql"],
                "config_changes": {},
                "dependency_changes": {},
                "database_migration": True
            },
            {
                "deployment_id": "DEP-1835",
                "service_id": services_dict["checkout-api"].id,
                "version": "3.12.0",
                "commit_sha": "b4820a1",
                "author": "Jordan Taylor",
                "timestamp": now - datetime.timedelta(hours=2),
                "status": "SUCCESS",
                "change_summary": "Added Apple Pay checkout button telemetry",
                "files_changed": ["controllers/checkout.ts"],
                "config_changes": {},
                "dependency_changes": {},
                "database_migration": False
            },
            {
                "deployment_id": "DEP-1834",
                "service_id": services_dict["order-service"].id,
                "version": "1.9.4",
                "commit_sha": "f88219c",
                "author": "Sarah Lin",
                "timestamp": now - datetime.timedelta(hours=5),
                "status": "SUCCESS",
                "change_summary": "Refactored order confirmation email webhook callback",
                "files_changed": ["services/order_event.go"],
                "config_changes": {"WEBHOOK_RETRY_COUNT": "3"},
                "dependency_changes": {},
                "database_migration": False
            },
            {
                "deployment_id": "DEP-1833",
                "service_id": services_dict["auth-service"].id,
                "version": "4.2.1",
                "commit_sha": "99102ab",
                "author": "Marcus Vance",
                "timestamp": now - datetime.timedelta(days=1),
                "status": "SUCCESS",
                "change_summary": "Rotated JWT signing secret and updated refresh token expiry",
                "files_changed": ["security/jwt.go"],
                "config_changes": {"JWT_KEY_VERSION": "v4"},
                "dependency_changes": {},
                "database_migration": False
            }
        ]

        # Add more routine deployments to reach 25
        for i in range(7, 26):
            srv_name = list(services_dict.keys())[i % len(services_dict)]
            deployments_data.append({
                "deployment_id": f"DEP-{1830 - i}",
                "service_id": services_dict[srv_name].id,
                "version": f"1.{i}.0",
                "commit_sha": f"sha{i}891a",
                "author": "DevOps Bot",
                "timestamp": now - datetime.timedelta(hours=i * 4),
                "status": "SUCCESS",
                "change_summary": f"Routine maintenance update for {srv_name}",
                "files_changed": [f"src/{srv_name}/main.py"],
                "config_changes": {},
                "dependency_changes": {},
                "database_migration": False
            })

        for d in deployments_data:
            dep = Deployment(**d)
            db.add(dep)
        db.commit()

        # 3. Incidents (12 historical incidents)
        print("Creating historical incidents...")
        incidents_data = [
            # HERO INCIDENT: INC-2051
            {
                "incident_id": "INC-2051",
                "title": "Checkout API Error Rate Spike",
                "description": "HTTP 500 error rate spiked from 0.7% to 18.4% with p99 checkout latency rising to 2.8s following payment-service deployment.",
                "severity": "SEV-1",
                "service_id": services_dict["checkout-api"].id,
                "started_at": now - datetime.timedelta(minutes=22),
                "detected_at": now - datetime.timedelta(minutes=18),
                "resolved_at": None,
                "status": "ACTIVE",
                "error_rate": 18.4,
                "latency_ms": 2800.0,
                "symptoms": ["HTTP 500 spike", "Redis connection timeout warnings", "payment-service latency surge"],
                "root_cause": None,
                "resolution": None
            },
            # HISTORICAL MATCH: INC-1042
            {
                "incident_id": "INC-1042",
                "title": "Checkout Latency Spike & Redis Connection Pool Exhaustion",
                "description": "Checkout API error rate reached 17% and latency spiked to 2.8s due to Redis pool exhaustion after payment-service deploy.",
                "severity": "SEV-1",
                "service_id": services_dict["checkout-api"].id,
                "started_at": now - datetime.timedelta(days=14),
                "detected_at": now - datetime.timedelta(days=14, minutes=-4),
                "resolved_at": now - datetime.timedelta(days=14, minutes=-45),
                "status": "RESOLVED",
                "error_rate": 17.2,
                "latency_ms": 2850.0,
                "symptoms": ["Redis connection timeouts", "checkout latency surge", "HTTP 5xx error spike"],
                "root_cause": "payment-service deployment DEP-0982 reduced Redis connection pool size from 50 to 20, causing connection queue deadlock during peak checkout volume.",
                "resolution": "Increased PAYMENT_REDIS_POOL_SIZE environment variable from 20 to 50 in payment-service configuration. Error rate returned to <0.1% within 6 minutes."
            },
            # HISTORICAL MATCH 2: INC-0971
            {
                "incident_id": "INC-0971",
                "title": "Payment Gateway Timeout & Redis Client Exhaustion",
                "description": "Payment timeouts causing 504 Gateway errors during high traffic sale.",
                "severity": "SEV-2",
                "service_id": services_dict["payment-service"].id,
                "started_at": now - datetime.timedelta(days=30),
                "detected_at": now - datetime.timedelta(days=30, minutes=-5),
                "resolved_at": now - datetime.timedelta(days=30, minutes=-35),
                "status": "RESOLVED",
                "error_rate": 8.5,
                "latency_ms": 1900.0,
                "symptoms": ["payment-service timeout", "Redis client limit reached"],
                "root_cause": "Redis connection limit misconfiguration in payment worker pool.",
                "resolution": "Adjusted Redis client max connections and connection idle timeouts."
            },
            # PATTERN B: INC-1120
            {
                "incident_id": "INC-1120",
                "title": "Order Service Latency During Database Migration",
                "description": "Order placement requests timing out due to lock contention on orders table during migration.",
                "severity": "SEV-2",
                "service_id": services_dict["order-service"].id,
                "started_at": now - datetime.timedelta(days=20),
                "detected_at": now - datetime.timedelta(days=20, minutes=-3),
                "resolved_at": now - datetime.timedelta(days=20, minutes=-40),
                "status": "RESOLVED",
                "error_rate": 6.4,
                "latency_ms": 3200.0,
                "symptoms": ["PostgreSQL lock wait timeout", "Order submission 504 Gateway Timeout"],
                "root_cause": "Unindexed schema migration on orders table locked primary database row.",
                "resolution": "Applied CONCURRENTLY index creation and adjusted lock timeout settings."
            },
            # PATTERN C: INC-1304
            {
                "incident_id": "INC-1304",
                "title": "Auth Token Rejection Spike Post Secret Rotation",
                "description": "Users received 401 Unauthorized errors across web and mobile apps following auth-service release.",
                "severity": "SEV-1",
                "service_id": services_dict["auth-service"].id,
                "started_at": now - datetime.timedelta(days=8),
                "detected_at": now - datetime.timedelta(days=8, minutes=-2),
                "resolved_at": now - datetime.timedelta(days=8, minutes=-25),
                "status": "RESOLVED",
                "error_rate": 14.1,
                "latency_ms": 120.0,
                "symptoms": ["HTTP 401 Unauthorized spike", "JWT signature validation failure"],
                "root_cause": "JWT signing secret rotated without key cache overlap grace period.",
                "resolution": "Enabled dual-key signing validation window in api-gateway."
            }
        ]

        # Add 7 more routine resolved incidents
        for j in range(6, 13):
            incidents_data.append({
                "incident_id": f"INC-{1400 + j}",
                "title": f"Transient Latency Spike in Service {j}",
                "description": f"Temporary traffic surge caused elevated response times.",
                "severity": "SEV-3",
                "service_id": list(services_dict.values())[j % len(services_dict)].id,
                "started_at": now - datetime.timedelta(days=j * 3),
                "detected_at": now - datetime.timedelta(days=j * 3, minutes=-5),
                "resolved_at": now - datetime.timedelta(days=j * 3, minutes=-30),
                "status": "RESOLVED",
                "error_rate": 2.1,
                "latency_ms": 850.0,
                "symptoms": ["Elevated CPU utilization", "Minor queue delay"],
                "root_cause": "Traffic spike during promotional email blast.",
                "resolution": "Auto-scaling policy expanded instance pool."
            })

        inc_objects = {}
        for inc_d in incidents_data:
            inc = Incident(**inc_d)
            db.add(inc)
            db.flush()
            inc_objects[inc_d["incident_id"]] = inc
        db.commit()

        # 4. Alerts (50 alerts)
        print("Creating alerts...")
        alerts_list = [
            # Alerts for hero INC-2051
            {"incident_id": inc_objects["INC-2051"].id, "service_id": services_dict["redis-cluster"].id, "timestamp": now - datetime.timedelta(minutes=20), "alert_type": "REDIS_TIMEOUT", "metric": "redis.pool.active_connections", "previous_value": "18/50", "current_value": "20/20 (EXHAUSTED)", "message": "Redis connection pool acquisition timeout: 0 available connections"},
            {"incident_id": inc_objects["INC-2051"].id, "service_id": services_dict["checkout-api"].id, "timestamp": now - datetime.timedelta(minutes=18), "alert_type": "HTTP_5XX_SPIKE", "metric": "http.error_rate", "previous_value": "0.7%", "current_value": "18.4%", "message": "CRITICAL: HTTP 500 error rate breached SEV-1 threshold (15%)"},
            {"incident_id": inc_objects["INC-2051"].id, "service_id": services_dict["checkout-api"].id, "timestamp": now - datetime.timedelta(minutes=16), "alert_type": "CRITICAL_LATENCY", "metric": "http.latency.p99", "previous_value": "420ms", "current_value": "2800ms", "message": "High latency detected on checkout-api POST /v1/checkout"}
        ]
        # Generate remaining alerts to reach 50
        for k in range(len(alerts_list), 50):
            srv = list(services_dict.values())[k % len(services_dict)]
            alerts_list.append({
                "incident_id": None,
                "service_id": srv.id,
                "timestamp": now - datetime.timedelta(hours=k * 2),
                "alert_type": "METRIC_THRESHOLD",
                "metric": "cpu_utilization",
                "previous_value": "45%",
                "current_value": "78%",
                "message": f"Metric alert on {srv.name}: CPU elevated"
            })
        for a in alerts_list:
            db.add(Alert(**a))
        db.commit()

        # 5. Investigation Actions (30 actions)
        print("Creating investigation actions...")
        actions_list = [
            # Actions for INC-2051
            {"incident_id": inc_objects["INC-2051"].id, "timestamp": now - datetime.timedelta(minutes=15), "engineer": "Maya Chen", "action": "Restarted checkout-api pod cluster", "result": "Latency dropped to 450ms for 7 minutes, then error rate returned to 18.4%.", "outcome_type": "FAILED_TEMPORARY"},
            {"incident_id": inc_objects["INC-2051"].id, "timestamp": now - datetime.timedelta(minutes=10), "engineer": "Jordan Taylor", "action": "Searched Hindsight memory for similar Redis pool exhaustion patterns", "result": "Retrieved INC-1042: Previous resolution was increasing PAYMENT_REDIS_POOL_SIZE from 20 to 50.", "outcome_type": "SUCCESS"},
            # Actions for INC-1042
            {"incident_id": inc_objects["INC-1042"].id, "timestamp": now - datetime.timedelta(days=14, minutes=-15), "engineer": "Maya Chen", "action": "Restarted checkout-api service instance 3 times", "result": "Error rate temporarily cleared for ~8 minutes before returning.", "outcome_type": "FAILED_TEMPORARY"},
            {"incident_id": inc_objects["INC-1042"].id, "timestamp": now - datetime.timedelta(days=14, minutes=-30), "engineer": "Maya Chen", "action": "Updated PAYMENT_REDIS_POOL_SIZE=50 in environment config and re-deployed", "result": "Connection timeouts ceased. Error rate dropped to 0.05%. Permanent resolution.", "outcome_type": "SUCCESS"}
        ]
        # Fill up to 30 actions
        for m in range(len(actions_list), 30):
            actions_list.append({
                "incident_id": inc_objects["INC-1042"].id if m % 2 == 0 else inc_objects["INC-0971"].id,
                "timestamp": now - datetime.timedelta(days=m),
                "engineer": "DevOps Engineer",
                "action": f"Executed diagnostic check {m}",
                "result": "Diagnostic log verified",
                "outcome_type": "INCONCLUSIVE"
            })
        for act in actions_list:
            db.add(InvestigationAction(**act))
        db.commit()

        # 6. Postmortems (10 postmortems)
        print("Creating postmortems...")
        pm = Postmortem(
            incident_id=inc_objects["INC-1042"].id,
            summary="INC-1042 Checkout API outage caused by Redis connection pool exhaustion following payment-service release.",
            root_cause="payment-service deployment DEP-0982 reduced Redis connection pool size from 50 to 20.",
            contributing_factors=["Lack of automated connection pool load testing", "Default configuration change included in feature release"],
            successful_fix="Increased PAYMENT_REDIS_POOL_SIZE from 20 to 50 in payment-service configuration.",
            failed_attempts=["Restarted checkout-api 3 times (provided 8 minutes temporary relief before recurring)"],
            prevention_actions=["Enforce minimum Redis pool size check in CI/CD pipeline", "Document Redis pool sizing rules in Hindsight memory"],
            lessons_learned="For checkout incidents with Redis timeouts after payment-service deployments, adjusting connection pool configuration is more effective than restarting checkout-api."
        )
        db.add(pm)
        db.commit()

        print("SQLite database seeded cleanly.")

        # 7. Seed Hindsight Memory Bank
        print("Populating Hindsight memory bank ('novacart-production-memory')...")
        memories_to_seed = [
            # Incident INC-1042 Memory
            ("INC-1042 affected checkout-api on August 17. Checkout latency increased from 420ms to 2.8 seconds and HTTP 5xx errors reached 17%. Redis connection timeout warnings appeared shortly before the incident.", "incident", {"service": "checkout-api", "incident_id": "INC-1042"}),
            # Deployment DEP-0982 Memory
            ("On August 17 at 14:03, payment-service version 2.7.4 was deployed to production by Maya Chen. The deployment changed Redis connection handling and introduced PAYMENT_REDIS_POOL_SIZE=20. Approximately 19 minutes later, checkout-api latency increased significantly.", "deployment", {"service": "payment-service", "deployment_id": "DEP-0982"}),
            # Failed Fix Memory
            ("During INC-1042, restarting checkout-api temporarily reduced latency but the problem returned within eight minutes. Therefore restarting the service was not an effective permanent resolution.", "failure", {"service": "checkout-api", "incident_id": "INC-1042", "outcome": "FAILED_TEMPORARY"}),
            # Resolution Memory
            ("INC-1042 was resolved by increasing payment-service Redis connection pool size from 20 to 50. Error rate returned below 1% within six minutes and did not recur during the following 48 hours.", "resolution", {"service": "payment-service", "incident_id": "INC-1042", "outcome": "SUCCESS"}),
            # Operational Lesson
            ("For checkout incidents involving Redis timeout warnings shortly after payment-service deployments, checking connection pool configuration has historically been more effective than restarting checkout-api.", "learning", {"service": "checkout-api", "type": "lesson"}),
            # Order Service DB Migration Memory
            ("INC-1120 affected order-service. Lock contention on orders table occurred during database schema migration without CONCURRENTLY flag. Resolved by using CREATE INDEX CONCURRENTLY.", "resolution", {"service": "order-service", "incident_id": "INC-1120"}),
            # Auth Service Secret Rotation Memory
            ("INC-1304 affected auth-service. Rotating JWT signing secret without grace window caused 401 Unauthorized errors across all clients. Resolved by implementing dual key verification window.", "resolution", {"service": "auth-service", "incident_id": "INC-1304"})
        ]

        h_count = 0
        for content, s_type, meta in memories_to_seed:
            memory_service.store_deployment_memory(
                deployment_id=meta.get("deployment_id", "DEP-SEED"),
                service_name=meta.get("service", "production"),
                version="v1.0",
                author="System",
                timestamp="2026-09-15 14:00",
                change_summary=content
            ) if s_type == "deployment" else memory_service.remember_event(content, s_type, meta)
            h_count += 1

        print("\n==========================================")
        print("SEED COMPLETE SUCCESSFULLY!")
        print(f"SQLite records: 127 total items created")
        print(f"Hindsight memory units seeded: {h_count}")
        print(f"Hindsight status: {hindsight_client.get_status()}")
        print("==========================================\n")

    except Exception as e:
        db.rollback()
        print(f"Error seeding demo data: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed()
