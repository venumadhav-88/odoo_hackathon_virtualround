# Enterprise Asset Management System — Backend API

Production-grade FastAPI backend for the EAM platform.

---

## Project Overview

This service provides the REST API layer for the Enterprise Asset
Management System.  It is responsible for exposing versioned endpoints
consumed by the React frontend and any future integrations.

The backend follows a strict layered architecture that separates
request handling, business logic, and data access concerns.

---

## Architecture

```
HTTP Client
    │
    ▼
API Layer  (app/api/v1/)
    │   Validates input, calls services, returns responses
    │
    ▼
Service Layer  (app/services/)
    │   Orchestrates business rules, calls repositories
    │
    ▼
Repository Layer  (app/repositories/)
        Abstracts all data-source interactions
```

Middleware and cross-cutting concerns (logging, exception handling,
CORS) are applied at the application layer before any request reaches
a route handler.

---

## Folder Structure

```
backend/
├── app/
│   ├── main.py                  # Application factory and Uvicorn entry point
│   ├── api/
│   │   └── v1/
│   │       ├── router.py        # Central v1 router — aggregates sub-routers
│   │       └── health.py        # GET /api/v1/health
│   ├── core/
│   │   ├── config.py            # Pydantic Settings loader (singleton)
│   │   └── constants.py         # Immutable application-wide constants
│   ├── middleware/
│   │   ├── exception_handler.py # Global exception → error envelope converter
│   │   └── request_logger.py    # Structured request/response logging
│   ├── common/
│   │   ├── responses.py         # Standard response envelope + builder helpers
│   │   └── exceptions.py        # Custom exception hierarchy
│   ├── dependencies/
│   │   └── common.py            # Shared FastAPI Depends() callables
│   ├── services/                # Business logic (Phase B2+)
│   ├── repositories/            # Data access abstraction (Phase B2+)
│   ├── schemas/                 # Pydantic v2 request/response DTOs (Phase B2+)
│   ├── models/                  # Domain / ORM models (Phase B3+)
│   └── utils/                   # Stateless helper functions
└── tests/                       # Test suite
```

---

## Technology Stack

| Component         | Library / Version        |
|-------------------|--------------------------|
| Language          | Python 3.12              |
| Framework         | FastAPI 0.115.5          |
| ASGI Server       | Uvicorn 0.32.1           |
| Data Validation   | Pydantic v2 / 2.10.3     |
| Settings          | pydantic-settings 2.6.1  |
| Environment       | python-dotenv 1.0.1      |
| Logging           | Loguru 0.7.3             |
| HTTP Client       | httpx 0.27.2             |

---

## Environment Variables

Copy `.env.example` to `.env` and set appropriate values.

| Variable           | Description                               | Required |
|--------------------|-------------------------------------------|----------|
| `APP_NAME`         | Display name shown in Swagger UI          | No       |
| `API_VERSION`      | Semantic version string                   | No       |
| `DEBUG`            | Enable debug mode and verbose logging     | No       |
| `HOST`             | Bind address for Uvicorn                  | No       |
| `PORT`             | Bind port for Uvicorn                     | No       |
| `SECRET_KEY`       | Application secret (future auth use)      | **Yes**  |
| `DATABASE_URL`     | Async database connection string          | Phase B3 |
| `SUPABASE_URL`     | Supabase project URL                      | Phase B3 |
| `SUPABASE_KEY`     | Supabase anon/service key                 | Phase B3 |
| `ALLOWED_ORIGINS`  | Comma-separated CORS allowed origins      | No       |

---

## Installation

**Prerequisite:** Python 3.12 or later.

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (macOS / Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Prepare environment configuration
cp .env.example .env
```

---

## Run Instructions

```bash
# Development server with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## Development Commands

```bash
# Run the development server
uvicorn app.main:app --reload

# Verify linting (requires ruff, optional)
ruff check app/

# Run the test suite (requires pytest, Phase B2+)
pytest tests/ -v
```

---

## API Version

Current API version: **v1**

| Endpoint              | Method | Description           | Auth     |
|-----------------------|--------|-----------------------|----------|
| `/api/v1/health`      | GET    | Application health    | None     |

---

## Interactive Documentation

| Tool    | URL                              |
|---------|----------------------------------|
| Swagger | http://localhost:8000/docs       |
| ReDoc   | http://localhost:8000/redoc      |
| OpenAPI | http://localhost:8000/openapi.json |
