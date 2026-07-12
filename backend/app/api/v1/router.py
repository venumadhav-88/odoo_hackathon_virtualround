"""
Central v1 router.

Aggregates all API v1 sub-routers under a single ``APIRouter`` instance.
The application factory mounts this router at the ``/api/v1`` prefix.

Adding a new resource
---------------------
1. Create ``app/api/v1/<resource>.py`` with its own ``APIRouter``.
2. Import and include it below with an appropriate prefix and tags.
"""

from fastapi import APIRouter

from app.api.v1 import health
from app.api.v1 import categories
from app.api.v1 import assets
from app.api.v1 import assignments
from app.api.v1 import maintenance
from app.api.v1 import dashboard
from app.api.v1 import reports

router = APIRouter()

router.include_router(health.router)
router.include_router(categories.router)
router.include_router(assets.router)
router.include_router(assignments.router)
router.include_router(maintenance.router)
router.include_router(dashboard.router)
router.include_router(reports.router)





