# Global Remittance Cost Map (POC-98)

An enterprise-grade fintech intelligence dashboard for the **Real Rails Intelligence Library** comparing remittance costs, settlement speed, accessibility, and corridor-level characteristics across major global routes.

This platform helps institutions and developers understand how money moves internationally, who controls the underlying payment rails, and the trade-offs between formal and informal transfer systems.

## Data & Domain References

- **World Bank**: Remittance Prices Worldwide Standards
- **European Central Bank (ECB)**: Reference Rate Data Portals
- **International Monetary Fund (IMF)**: Financial Access Survey (FAS)
- **SWIFT**: Settlement & Cleared Payment Guidelines

---

## Key Features

### Executive Overview Dashboard
Provides high-level operational visibility and system health:
- **Connected Corridors**: Active transaction paths across global corridors.
- **Countries Covered**: Node-level analysis of sender/receiver regions.
- **Average Cost Percent**: Running average cost across all transaction corridors.
- **Average Settlement Time**: Cross-border speed benchmark (hours).
- **Affordable and Expensive Corridors**: Automatically identifies lowest and highest friction transfer routes.

### Interactive Geospatial Corridor Map
- Custom vector overlays depicting cross-border flows.
- Dynamic side-drawer updates with specific corridor metrics upon route selection.
- Pulsing visual markers representing regional payment hotspots.

### Fee Compare Analytics
- Stacked provider cost metrics (Percent Fee, Fixed Fee, FX Spread Markup).
- Simulates true **Effective Cost** calculations on a standard transfer size of $500.

### Speed Ladder
- Direct visual mapping of settlement timelines (Instant vs. Same Day vs. Multi-day).
- Focuses on provider-by-provider liquidity and clearing delays.

### Access Points Breakdown
- Accessibility index by payout destination (Cash Pickups, Mobile Wallets, Bank Accounts).

### Corridor Explorer Database
- High-fidelity search and sort mechanics powered by TanStack Table.
- Fast filtering by Origin/Destination codes, average cost, speed, and risk score.

### Payment Rails Education Center
- Explains institutional payment paths: Central Banks, Card Networks, SWIFT, Fintechs, and Hawala networks.

### Data Ingestion & Download Center
- Instantly downloads structured CSV/JSON dumps generated directly by backend Pandas pipelines.

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: React Leaflet / Leaflet
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.10+
- **Data Engine**: Pandas
- **Validation**: Pydantic v2
- **Server**: Uvicorn

---

## System Architecture

```mermaid
graph TD
    subgraph Frontend (Next.js 15+)
        UI[Intelligence Dashboard UI]
        Map[React Leaflet Map]
        Charts[Recharts Analytics]
        Table[TanStack Explorer Table]
        APIClient[Client API Adapter]
    end

    subgraph Backend (FastAPI / Python)
        API[FastAPI Endpoints]
        DB[(In-Memory Database / JSON)]
        Gen[Mock Data Generator]
        Adapters[ETL Data Adapters]
    end

    subgraph External Sources (Future)
        WB[World Bank API]
        ECB[ECB Data Portal]
    end

    UI --> Map & Charts & Table
    APIClient --> UI
    APIClient -- HTTP / JSON --> API
    API --> DB
    Adapters --> DB
    Gen --> DB
    WB & ECB -.-> Adapters
```

---

## Intelligence Layer
Instead of serving static raw files, the backend logic:
- Computes real-time corridor risk assessments.
- Integrates custom `SyntheticRemittanceAdapter` to aggregate and validate multi-faceted metrics.
- Provides compliance, speed, and cost expectations.

## Data Integrity
- **Unified Calculations**: Ingestion pipeline enforces schema validation via Pydantic (`models.py`).
- **Consistent Metrics**: Summary cards, CSV spreadsheets, and JSON feeds consume identical mathematical calculation utilities.

## Responsive Design
Tested and validated across the following layouts:
- **Desktop** (1440px)
- **Laptop** (1280px)
- **Tablet** (1024px)
- **Small Tablet** (768px)
- **Mobile** (480px)

---

## Installation & Running Locally

### Backend Setup
1. Navigate to `/backend`:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   python run.py
   ```
   The backend will run on `http://localhost:8000`.

### Frontend Setup
1. Navigate to `/frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:3000`.

---

## Validation Results

- **Build Validation (`npm run build`)**: `PASS`
- **Lint Validation (`npm run lint`)**: `PASS`
- **Responsive Validation**: `PASS`
- **Data Integrity Validation**: `PASS`
- **User Acceptance Testing (UAT)**: `PASS`

---

## Repository Contents

- `backend/` - FastAPI service endpoints, Pydantic schemas, data adapters, and database loaders.
- `frontend/` - Next.js interactive UI components, maps, and stateful widgets.
- `README.md` - Core system operational documentation.
- `architecture_documentation.md` - Detailed architectural diagrams and component specifications.

---

## Project Status

- [x] Backend FastAPI Server Ingestion Node Functional
- [x] Next.js Geospatial Dashboard Operational
- [x] Data Export & CSV Pipelines Operational
- [x] Linting & TypeScript Type Safety Verified
- [x] Responsive Adaptations Implemented

