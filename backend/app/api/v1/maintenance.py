"""
Maintenance API router — /api/v1/maintenance
"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Path
from fastapi.responses import JSONResponse
from loguru import logger

from app.common.responses import (
    SuccessResponse,
    created_response,
    no_content_response,
    success_response,
)
from app.dependencies.auth import (
    require_admin,
    require_any_authenticated_role,
    require_manager_or_above,
)
from app.repositories.maintenance_repository import MaintenanceRepository
from app.schemas.maintenance import (
    MaintenanceComplete,
    MaintenanceCreate,
    MaintenanceFilter,
    MaintenanceListResponse,
    MaintenanceResponse,
    MaintenanceUpdate,
)
from app.schemas.user import CurrentUser
from app.services.maintenance_service import MaintenanceService

# ── Router ────────────────────────────────────────────────────────────────

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])


def _get_maintenance_service() -> MaintenanceService:
    return MaintenanceService(repository=MaintenanceRepository())


# ── Endpoints ─────────────────────────────────────────────────────────────


@router.get(
    "/",
    summary="List Maintenance",
    description="Returns a paginated list of maintenance records.",
    response_model=SuccessResponse[MaintenanceListResponse],
    response_class=JSONResponse,
)
async def list_maintenance(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: MaintenanceService = Depends(_get_maintenance_service),
) -> JSONResponse:
    logger.debug("list_maintenance | user={}", current_user.email)
    result = await service.get_maintenances(page=page, page_size=page_size)
    return success_response("Maintenance records retrieved.", data=result.model_dump())


@router.get(
    "/search",
    summary="Search Maintenance",
    description="Returns maintenance records matching a query.",
    response_model=SuccessResponse[List[MaintenanceResponse]],
    response_class=JSONResponse,
)
async def search_maintenance(
    query: str = Query(..., min_length=2),
    limit: int = Query(10, ge=1, le=50),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: MaintenanceService = Depends(_get_maintenance_service),
) -> JSONResponse:
    result = await service.search(query=query, limit=limit)
    return success_response("Search completed.", data=[m.model_dump() for m in result])


@router.post(
    "/filter",
    summary="Filter Maintenance",
    description="Returns filtered maintenance records.",
    response_model=SuccessResponse[MaintenanceListResponse],
    response_class=JSONResponse,
)
async def filter_maintenance(
    filters: MaintenanceFilter,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: MaintenanceService = Depends(_get_maintenance_service),
) -> JSONResponse:
    result = await service.filter(filters, page=page, page_size=page_size)
    return success_response("Filter applied.", data=result.model_dump())


@router.get(
    "/{maintenance_id}",
    summary="Get Maintenance",
    description="Returns details of a single maintenance task.",
    response_model=SuccessResponse[MaintenanceResponse],
    response_class=JSONResponse,
)
async def get_maintenance(
    maintenance_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: MaintenanceService = Depends(_get_maintenance_service),
) -> JSONResponse:
    record = await service.get_maintenance(maintenance_id)
    return success_response("Task retrieved.", data=record.model_dump())


@router.post(
    "/",
    summary="Create Maintenance",
    description="Schedules a new maintenance task (alias for POST /schedule).",
    response_model=SuccessResponse[MaintenanceResponse],
    response_class=JSONResponse,
    status_code=201,
)
async def create_maintenance(
    payload: MaintenanceCreate,
    current_user: CurrentUser = Depends(require_manager_or_above),
    service: MaintenanceService = Depends(_get_maintenance_service),
) -> JSONResponse:
    created = await service.create_maintenance(payload)
    return created_response("Task created.", data=created.model_dump())


@router.put(
    "/{maintenance_id}",
    summary="Update Maintenance",
    description="Replaces fields of an existing task.",
    response_model=SuccessResponse[MaintenanceResponse],
    response_class=JSONResponse,
)
async def update_maintenance(
    payload: MaintenanceUpdate,
    maintenance_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_manager_or_above),
    service: MaintenanceService = Depends(_get_maintenance_service),
) -> JSONResponse:
    updated = await service.update_maintenance(maintenance_id, payload)
    return success_response("Task updated.", data=updated.model_dump())


@router.delete(
    "/{maintenance_id}",
    summary="Delete Maintenance",
    description="Permanently deletes a task. Admin only.",
    response_model=SuccessResponse[None],
    response_class=JSONResponse,
)
async def delete_maintenance(
    maintenance_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_admin),
    service: MaintenanceService = Depends(_get_maintenance_service),
) -> JSONResponse:
    await service.delete_maintenance(maintenance_id)
    return no_content_response("Task deleted.")


# ── Workflow Endpoints ────────────────────────────────────────────────────


@router.post(
    "/{maintenance_id}/schedule",
    summary="Workflow: Schedule",
    description="Alternative endpoint to create a scheduled task.",
    response_model=SuccessResponse[MaintenanceResponse],
    response_class=JSONResponse,
)
async def workflow_schedule(
    payload: MaintenanceCreate,
    maintenance_id: UUID = Path(..., description="Ignored, dynamically generated if new."),
    current_user: CurrentUser = Depends(require_manager_or_above),
    service: MaintenanceService = Depends(_get_maintenance_service),
) -> JSONResponse:
    created = await service.schedule(payload)
    return success_response("Task scheduled.", data=created.model_dump())


@router.post(
    "/{maintenance_id}/start",
    summary="Workflow: Start",
    description="Marks a task as in progress.",
    response_model=SuccessResponse[MaintenanceResponse],
    response_class=JSONResponse,
)
async def workflow_start(
    maintenance_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_manager_or_above),
    service: MaintenanceService = Depends(_get_maintenance_service),
) -> JSONResponse:
    started = await service.start(maintenance_id)
    return success_response("Task started.", data=started.model_dump())


@router.post(
    "/{maintenance_id}/complete",
    summary="Workflow: Complete",
    description="Marks a task as completed with costs.",
    response_model=SuccessResponse[MaintenanceResponse],
    response_class=JSONResponse,
)
async def workflow_complete(
    payload: MaintenanceComplete,
    maintenance_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_manager_or_above),
    service: MaintenanceService = Depends(_get_maintenance_service),
) -> JSONResponse:
    completed = await service.complete(maintenance_id, payload)
    return success_response("Task completed.", data=completed.model_dump())


@router.post(
    "/{maintenance_id}/cancel",
    summary="Workflow: Cancel",
    description="Cancels a maintenance task. Admin only.",
    response_model=SuccessResponse[MaintenanceResponse],
    response_class=JSONResponse,
)
async def workflow_cancel(
    maintenance_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_admin),
    service: MaintenanceService = Depends(_get_maintenance_service),
) -> JSONResponse:
    cancelled = await service.cancel(maintenance_id)
    return success_response("Task cancelled.", data=cancelled.model_dump())


@router.get(
    "/{maintenance_id}/history",
    summary="Maintenance History",
    description="Returns the event history of a specific task.",
    response_model=SuccessResponse[List[dict]],
    response_class=JSONResponse,
)
async def get_maintenance_history(
    maintenance_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: MaintenanceService = Depends(_get_maintenance_service),
) -> JSONResponse:
    timeline = await service.history(maintenance_id)
    return success_response("History retrieved.", data=timeline)
