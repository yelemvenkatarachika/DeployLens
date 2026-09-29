import logging
from typing import List, Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class HindsightClientWrapper:
    """
    Wrapper around official hindsight-client Python SDK.
    Provides robust status reporting and dynamic connection handling.
    """

    def __init__(self):
        self.bank_id = settings.HINDSIGHT_BANK_ID
        self.base_url = settings.HINDSIGHT_BASE_URL
        self.api_key = settings.HINDSIGHT_API_KEY
        self.client = None
        self._is_connected = False
        self._init_client()

    def _init_client(self):
        # Reload settings dynamically
        self.bank_id = settings.HINDSIGHT_BANK_ID
        self.base_url = settings.HINDSIGHT_BASE_URL
        self.api_key = settings.HINDSIGHT_API_KEY

        try:
            from hindsight_client import Hindsight
            kwargs = {"base_url": self.base_url}
            if self.api_key:
                kwargs["api_key"] = self.api_key
            self.client = Hindsight(**kwargs)
            
            # If API key is present or base_url set, mark connected
            if self.api_key or "localhost" in self.base_url or "vectorize.io" in self.base_url:
                self._is_connected = True
            else:
                self._is_connected = False
        except Exception as e:
            logger.error(f"Failed to initialize Hindsight SDK client: {e}")
            self.client = None
            self._is_connected = False

    def is_connected(self) -> bool:
        if not self._is_connected or not self.client:
            self._init_client()
        return self._is_connected and not settings.DEMO_MODE

    def get_status(self) -> str:
        if settings.DEMO_MODE:
            return "Demo Fallback Active"
        if self.is_connected():
            return "Hindsight Connected"
        return "Hindsight Unavailable"

    def retain(self, content: str, metadata: Optional[Dict[str, str]] = None, tags: Optional[List[str]] = None) -> bool:
        if not self.is_connected() or settings.DEMO_MODE:
            logger.info("Hindsight retain bypassed (Demo Mode / Offline)")
            return True
        try:
            self.client.retain(
                bank_id=self.bank_id,
                content=content,
                metadata=metadata,
                tags=tags
            )
            self._is_connected = True
            return True
        except Exception as e:
            logger.error(f"Hindsight retain error: {e}")
            return False

    def recall(self, query: str, tags: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        if not self.is_connected() or settings.DEMO_MODE:
            logger.info("Hindsight recall bypassed (Demo Mode / Offline)")
            return []
        try:
            response = self.client.recall(
                bank_id=self.bank_id,
                query=query,
                tags=tags
            )
            self._is_connected = True
            results = []
            if hasattr(response, "results") and response.results:
                for r in response.results:
                    text = getattr(r, "text", getattr(r, "content", str(r)))
                    meta = getattr(r, "metadata", {})
                    score = getattr(r, "score", getattr(r, "similarity", 0.85))
                    results.append({
                        "content": text,
                        "metadata": meta,
                        "score": score
                    })
            return results
        except Exception as e:
            logger.error(f"Hindsight recall error: {e}")
            return []

    def reflect(self, query: str) -> Optional[str]:
        if not self.is_connected() or settings.DEMO_MODE:
            return None
        try:
            resp = self.client.reflect(bank_id=self.bank_id, query=query)
            if hasattr(resp, "text"):
                return resp.text
            elif hasattr(resp, "content"):
                return resp.content
            return str(resp)
        except Exception as e:
            logger.error(f"Hindsight reflect error: {e}")
            return None

    def list_memories(self, query: Optional[str] = None) -> List[Dict[str, Any]]:
        if not self.is_connected() or settings.DEMO_MODE:
            return []
        try:
            resp = self.client.list_memories(bank_id=self.bank_id, search_query=query, limit=100)
            items = []
            if hasattr(resp, "memories"):
                for m in resp.memories:
                    items.append({
                        "id": getattr(m, "id", "mem_unit"),
                        "content": getattr(m, "text", getattr(m, "content", "")),
                        "metadata": getattr(m, "metadata", {})
                    })
            return items
        except Exception as e:
            logger.error(f"Hindsight list_memories error: {e}")
            return []

hindsight_client = HindsightClientWrapper()
