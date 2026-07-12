"""
Dashboard API router — /api/v1/dashboard
"""

from typing import List

from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse

from app.common.responses import SuccessResponse, success_response
from app.dependencies.auth import require_any_authenticated_role
from app.repositories.dashboard_repository import DashboardRepository
from app.schemas.dashboard import (
    AssetStatistics,
    AssignmentStatistics,
    CategoryStatistics,
    DashboardSummary,
    MaintenanceStatistics,
    RecentActivity,
    TrendMetric,
)
from app.schemas.user import CurrentUser
from app.services.dashboard_service import DashboardService

# ── Router ────────────────────────────────────────────────────────────────

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def _get_dashboard_service() -> DashboardService:
    return DashboardService(repository=DashboardRepository())


# ── Endpoints ─────────────────────────────────────────────────────────────


@router.get(
    "/summary",
    summary="Dashboard Summary",
    description="Returns high-level aggregate dashboard metrics and recent activities.",
    response_model=SuccessResponse[DashboardSummary],
    response_class=JSONResponse,
)
async def get_summary(
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: DashboardService = Depends(_get_dashboard_service),
) -> JSONResponse:
    summary = await service.get_dashboard_summary()
    return success_response("Dashboard summary retrieved.", data=summary.model_dump())


@router.get(
    "/assets",
    summary="Asset Statistics",
    description="Returns detailed statistics on assets.",
    response_model=SuccessResponse[AssetStatistics],
    response_class=JSONResponse,
)
async def get_assets_stats(
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: DashboardService = Depends(_get_dashboard_service),
) -> JSONResponse:
    stats = await service.get_asset_statistics()
    return success_response("Asset statistics retrieved.", data=stats.model_dump())


@router.get(
    "/assignments",
    summary="Assignment Statistics",
    description="Returns detailed statistics on assignments.",
    response_model=SuccessResponse[AssignmentStatistics],
    response_class=JSONResponse,
)
async def get_assignments_stats(
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: DashboardService = Depends(_get_dashboard_service),
) -> JSONResponse:
    stats = await service.get_assignment_statistics()
    return success_response("Assignment statistics retrieved.", data=stats.model_dump())


@router.get(
    "/maintenance",
    summary="Maintenance Statistics",
    description="Returns detailed statistics on maintenance tasks.",
    response_model=SuccessResponse[MaintenanceStatistics],
    response_class=JSONResponse,
)
async def get_maintenance_stats(
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: DashboardService = Depends(_get_dashboard_service),
) -> JSONResponse:
    stats = await service.get_maintenance_statistics()
    return success_response("Maintenance statistics retrieved.", data=stats.model_dump())


@router.get(
    "/categories",
    summary="Category Statistics",
    description="Returns detailed statistics on categories.",
    response_model=SuccessResponse[CategoryStatistics],
    response_class=JSONResponse,
)
async def get_category_stats(
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: DashboardService = Depends(_get_dashboard_service),
) -> JSONResponse:
    stats = await service.get_category_statistics()
    return success_response("Category statistics retrieved.", data=stats.model_dump())


@router.get(
    "/recent-activities",
    summary="Recent Activities",
    description="Returns a feed of recent system activities.",
    response_model=SuccessResponse[List[RecentActivity]],
    response_class=JSONResponse,
)
async def get_recent_activities(
    limit: int = Query(10, ge=1, le=50),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: DashboardService = Depends(_get_dashboard_service),
) -> JSONResponse:
    activities = await service.get_recent_activities(limit=limit)
    return success_response("Recent activities retrieved.", data=[a.model_dump() for a in activities])


@router.get(
    "/trends",
    summary="System Trends",
    description="Returns trending metrics over time.",
    response_model=SuccessResponse[List[TrendMetric]],
    response_class=JSONResponse,
)
async def get_trends(
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: DashboardService = Depends(_get_dashboard_service),
) -> JSONResponse:
    trends = await service.get_trends()
    return success_response("Trends retrieved.", data=[t.model_dump() for t in trends])
