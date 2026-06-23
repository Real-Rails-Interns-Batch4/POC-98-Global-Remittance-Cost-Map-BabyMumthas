import random
import json
import os
from typing import List, Dict, Any
from app.models import Corridor, Provider
from app.adapters.base import BaseRemittanceAdapter

# Load static coordinate database from JSON file
_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

with open(os.path.join(_DATA_DIR, "country_geolocations.json"), "r", encoding="utf-8") as f:
    COUNTRY_GEOLOCATIONS: Dict[str, Dict[str, Any]] = json.load(f)

with open(os.path.join(_DATA_DIR, "corridor_definitions.json"), "r", encoding="utf-8") as f:
    CORRIDOR_DEFS: List[List[str]] = json.load(f)

class SyntheticRemittanceAdapter(BaseRemittanceAdapter):
    def fetch_corridors(self) -> List[Corridor]:
        corridors = []
        random.seed(42)  # For deterministic data generation

        for i, (orig, dest) in enumerate(CORRIDOR_DEFS):
            orig_geo = COUNTRY_GEOLOCATIONS[orig]
            dest_geo = COUNTRY_GEOLOCATIONS[dest]

            # Generate structured providers
            providers = [
                Provider(
                    name="Wise",
                    fee_percent=round(random.uniform(0.3, 0.6), 2),
                    fixed_fee=round(random.uniform(0.5, 1.5), 2),
                    fx_spread=round(random.uniform(0.1, 0.25), 2),
                    settlement_time_hours=round(random.uniform(0.5, 4.0), 2),
                    accessibility_score=random.randint(85, 95)
                ),
                Provider(
                    name="Western Union",
                    fee_percent=round(random.uniform(1.2, 2.5), 2),
                    fixed_fee=round(random.uniform(2.0, 4.0), 2),
                    fx_spread=round(random.uniform(1.5, 3.0), 2),
                    settlement_time_hours=round(random.uniform(0.5, 24.0), 2),
                    accessibility_score=random.randint(90, 98)
                ),
                Provider(
                    name="MoneyGram",
                    fee_percent=round(random.uniform(1.0, 2.2), 2),
                    fixed_fee=round(random.uniform(1.5, 3.5), 2),
                    fx_spread=round(random.uniform(1.2, 2.8), 2),
                    settlement_time_hours=round(random.uniform(0.5, 12.0), 2),
                    accessibility_score=random.randint(88, 96)
                ),
                Provider(
                    name="Bank Transfer (SWIFT)",
                    fee_percent=round(random.uniform(0.0, 0.3), 2),
                    fixed_fee=round(random.uniform(15.0, 30.0), 2),
                    fx_spread=round(random.uniform(1.0, 2.2), 2),
                    settlement_time_hours=round(random.uniform(48.0, 72.0), 2),
                    accessibility_score=random.randint(55, 75)
                ),
                Provider(
                    name="Mobile Wallet Transfer",
                    fee_percent=round(random.uniform(0.5, 1.5), 2),
                    fixed_fee=round(random.uniform(0.5, 1.0), 2),
                    fx_spread=round(random.uniform(0.5, 1.2), 2),
                    settlement_time_hours=round(random.uniform(0.05, 0.5), 2),
                    accessibility_score=random.randint(82, 94)
                ),
                Provider(
                    name="Crypto (Stablecoins)",
                    fee_percent=round(random.uniform(0.0, 0.1), 2),
                    fixed_fee=round(random.uniform(1.0, 2.0), 2),
                    fx_spread=round(random.uniform(0.05, 0.15), 2),
                    settlement_time_hours=round(random.uniform(0.05, 0.2), 2),
                    accessibility_score=random.randint(40, 60)
                )
            ]

            # Calculate average cost and speed across providers
            # True Cost % of sending $500: ((fee_percent * 500 / 100) + fixed_fee + (fx_spread * 500 / 100)) / 500 * 100
            # which simplifies to: fee_percent + fx_spread + (fixed_fee / 5)
            costs = []
            speeds = []
            for p in providers:
                effective_cost = p.fee_percent + p.fx_spread + (p.fixed_fee / 5.0)
                costs.append(effective_cost)
                speeds.append(p.settlement_time_hours)

            avg_cost = round(sum(costs) / len(costs), 2)
            avg_speed = round(sum(speeds) / len(speeds), 1)
            risk_score = round(random.uniform(2.0, 8.0) if orig != "UA" else 8.5, 1)

            corridors.append(Corridor(
                id=f"{orig}-{dest}",
                origin_country=orig_geo["name"],
                origin_code=orig,
                origin_lat=orig_geo["lat"],
                origin_lng=orig_geo["lng"],
                destination_country=dest_geo["name"],
                destination_code=dest,
                destination_lat=dest_geo["lat"],
                destination_lng=dest_geo["lng"],
                average_cost_percent=avg_cost,
                average_speed_hours=avg_speed,
                risk_score=risk_score,
                providers=providers,
                receive_options=["Bank Deposit", "Mobile Wallet", "Cash Pickup", "Agent Network", "Digital Account"],
                is_synthetic=True
            ))

        return corridors
