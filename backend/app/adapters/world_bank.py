import os
from typing import List
from app.models import Corridor
from app.adapters.base import BaseRemittanceAdapter

WORLD_BANK_API_URL = os.getenv("WORLD_BANK_API_URL", "https://api.worldbank.org/v2")

class WorldBankAdapter(BaseRemittanceAdapter):
    def fetch_corridors(self) -> List[Corridor]:
        # In a real system, this would call:
        # http_client.get(f"{WORLD_BANK_API_URL}/.../remittance-cost")
        # And parse the resulting XML/JSON.
        print(f"WorldBankAdapter: Fetching reference World Bank data from {WORLD_BANK_API_URL} (stub)...")
        return []
