"""
Reports & Export API router — /api/v1/reports
"""

from typing import List

from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse

from app.common.responses import SuccessResponse, success_response
from app.dependencies.auth import (
    require_any_authenticated_role,
    require_manager_or_above,
)
from app.repositories.report_repository import ReportRepository
from app.schemas.report import (
    AssetReport,
    AssignmentReport,
    CategoryReport,
    ExportRequest,
    ExportResponse,
    MaintenanceReport,
    ReportFilter,
    ReportStatistics,
    ReportSummary,
    ReportTrend,
)
from app.schemas.user import CurrentUser
from app.services.report_service import ReportService

# ── Router ────────────────────────────────────────────────────────────────

router = APIRouter(prefix="/reports", tags=["Reports"])


def _get_report_service() -> ReportService:
    return ReportService(repository=ReportRepository())


# ── Endpoints ─────────────────────────────────────────────────────────────


@router.get(
    "/summary",
    summary="Report Summary",
    description="Returns an aggregated summary of the report data.",
    response_model=SuccessResponse[ReportSummary],
    response_class=JSONResponse,
)
async def get_summary(
    filters: ReportFilter = Depends(),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: ReportService = Depends(_get_report_service),
) -> JSONResponse:
    summary = await service.get_summary(filters)
    return success_response("Report summary retrieved.", data=summary.model_dump())


@router.get(
    "/assets",
    summary="Asset Report",
    description="Returns detailed asset report rows.",
    response_model=SuccessResponse[List[AssetReport]],
    response_class=JSONResponse,
)
async def get_assets(
    filters: ReportFilter = Depends(),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: ReportService = Depends(_get_report_service),
) -> JSONResponse:
    report = await service.get_asset_report(filters)
    return success_response("Asset report retrieved.", data=[r.model_dump() for r in report])


@router.get(
    "/assignments",
    summary="Assignment Report",
    description="Returns detailed assignment report rows.",
    response_model=SuccessResponse[List[AssignmentReport]],
    response_class=JSONResponse,
)
async def get_assignments(
    filters: ReportFilter = Depends(),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: ReportService = Depends(_get_report_service),
) -> JSONResponse:
    report = await service.get_assignment_report(filters)
    return success_response("Assignment report retrieved.", data=[r.model_dump() for r in report])


@router.get(
    "/maintenance",
    summary="Maintenance Report",
    description="Returns detailed maintenance report rows.",
    response_model=SuccessResponse[List[MaintenanceReport]],
    response_class=JSONResponse,
)
async def get_maintenance(
    filters: ReportFilter = Depends(),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: ReportService = Depends(_get_report_service),
) -> JSONResponse:
    report = await service.get_maintenance_report(filters)
    return success_response("Maintenance report retrieved.", data=[r.model_dump() for r in report])


@router.get(
    "/categories",
    summary="Category Report",
    description="Returns detailed category report rows.",
    response_model=SuccessResponse[List[CategoryReport]],
    response_class=JSONResponse,
)
async def get_categories(
    filters: ReportFilter = Depends(),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: ReportService = Depends(_get_report_service),
) -> JSONResponse:
    report = await service.get_category_report(filters)
    return success_response("Category report retrieved.", data=[r.model_dump() for r in report])


@router.get(
    "/statistics",
    summary="Report Statistics",
    description="Returns isolated aggregate statistics for the reports.",
    response_model=SuccessResponse[ReportStatistics],
    response_class=JSONResponse,
)
async def get_statistics(
    filters: ReportFilter = Depends(),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: ReportService = Depends(_get_report_service),
) -> JSONResponse:
    stats = await service.get_statistics(filters)
    return success_response("Report statistics retrieved.", data=stats.model_dump())


@router.get(
    "/trends",
    summary="Report Trends",
    description="Returns trending metrics corresponding to the filter period.",
    response_model=SuccessResponse[List[ReportTrend]],
    response_class=JSONResponse,
)
async def get_trends(
    filters: ReportFilter = Depends(),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: ReportService = Depends(_get_report_service),
) -> JSONResponse:
    trends = await service.get_trends(filters)
    return success_response("Report trends retrieved.", data=[t.model_dump() for t in trends])


@router.post(
    "/export",
    summary="Export Data",
    description="Exports a generated report to CSV or PDF.",
    response_model=SuccessResponse[ExportResponse],
    response_class=JSONResponse,
)
async def export_data(
    request: ExportRequest,
    current_user: CurrentUser = Depends(require_manager_or_above),
    service: ReportService = Depends(_get_report_service),
) -> JSONResponse:
    export_result = await service.export(request)
    return success_response("Export successfully generated.", data=export_result.model_dump())
