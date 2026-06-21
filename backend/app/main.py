from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import io
import json
import pandas as pd
from typing import List, Dict, Any
from app.models import Corridor, DashboardSummary
from app.generators.mock_data import SyntheticRemittanceAdapter

app = FastAPI(
    title="Global Remittance Cost Map API",
    description="Backend API for comparing remittance corridors, speeds, and provider metrics.",
    version="1.0.0"
)

# Enable CORS for Next.js development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database load
adapter = SyntheticRemittanceAdapter()
CORRIDOR_DATA = adapter.fetch_corridors()
SUMMARY_DATA = adapter.calculate_summary(CORRIDOR_DATA)

@app.get("/")
def root():
    return {
        "service": "Global Remittance Cost Map API",
        "status": "running",
        "docs": "/docs",
        "endpoints": ["/api/health", "/api/corridors", "/api/summary", "/api/download/csv", "/api/download/json"]
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Global Remittance Cost Map Ingestion Service"}

@app.get("/api/corridors", response_model=List[Corridor])
def get_corridors():
    """Get all 30+ corridors with provider and receiving details."""
    return CORRIDOR_DATA

@app.get("/api/summary", response_model=DashboardSummary)
def get_summary():
    """Get calculated high-level KPIs for the hero cards."""
    return SUMMARY_DATA

@app.get("/api/download/csv")
def download_csv():
    """Generate and download flat CSV of the synthetic dataset using Pandas."""
    flat_data = []
    for c in CORRIDOR_DATA:
        for p in c.providers:
            effective_cost = round(p.fee_percent + p.fx_spread + (p.fixed_fee / 5.0), 2)
            flat_data.append({
                "origin_country": c.origin_country,
                "origin_code": c.origin_code,
                "destination_country": c.destination_country,
                "destination_code": c.destination_code,
                "provider_name": p.name,
                "fee_percent": p.fee_percent,
                "fixed_fee": p.fixed_fee,
                "fx_spread": p.fx_spread,
                "effective_cost_percent": effective_cost,
                "settlement_time_hours": p.settlement_time_hours,
                "accessibility_score": p.accessibility_score,
                "corridor_risk_score": c.risk_score,
                "receive_options": ", ".join(c.receive_options),
                "is_synthetic": c.is_synthetic
            })
    
    df = pd.DataFrame(flat_data)
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    response = Response(content=stream.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=global_remittance_corridors_synthetic.csv"
    return response

@app.get("/api/download/json")
def download_json():
    """Download full structured JSON of the synthetic dataset."""
    data_dict = [c.model_dump() for c in CORRIDOR_DATA]
    json_str = json.dumps(data_dict, indent=2)
    response = Response(content=json_str, media_type="application/json")
    response.headers["Content-Disposition"] = "attachment; filename=global_remittance_corridors_synthetic.json"
    return response
