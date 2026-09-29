import os
from dotenv import load_dotenv

# Ensure dotenv loads with override=True
load_dotenv(override=True)

class Settings:
    PROJECT_NAME: str = "DeployLens"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    @property
    def DATABASE_URL(self) -> str:
        load_dotenv(override=True)
        return os.getenv("DATABASE_URL", "sqlite:///./backend/data/deploylens.db")

    @property
    def GROQ_API_KEY(self) -> str:
        load_dotenv(override=True)
        return os.getenv("GROQ_API_KEY", "")

    @property
    def LLM_MODEL(self) -> str:
        load_dotenv(override=True)
        return os.getenv("LLM_MODEL", "qwen-2.5-32b")

    @property
    def HINDSIGHT_API_KEY(self) -> str:
        load_dotenv(override=True)
        return os.getenv("HINDSIGHT_API_KEY", "")

    @property
    def HINDSIGHT_BASE_URL(self) -> str:
        load_dotenv(override=True)
        return os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io")

    @property
    def HINDSIGHT_BANK_ID(self) -> str:
        load_dotenv(override=True)
        return os.getenv("HINDSIGHT_BANK_ID", "novacart-production-memory")

    @property
    def DEMO_MODE(self) -> bool:
        load_dotenv(override=True)
        return os.getenv("DEMO_MODE", "false").lower() in ("true", "1", "yes")

    def refresh(self):
        load_dotenv(override=True)

settings = Settings()
