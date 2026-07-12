"""
Assignments API router — /api/v1/assignments
"""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Path, Body
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
from app.repositories.assignment_repository import AssignmentRepository
from app.schemas.assignment import (
    AssignmentCreate,
    AssignmentFilter,
    AssignmentListResponse,
    AssignmentResponse,
    AssignmentReturn,
    AssignmentTimelineResponse,
    AssignmentUpdate,
)
from app.schemas.user import CurrentUser
from app.services.assignment_service import AssignmentService

# ── Router ────────────────────────────────────────────────────────────────

router = APIRouter(prefix="/assignments", tags=["Assignments"])


def _get_assignment_service() -> AssignmentService:
    return AssignmentService(repository=AssignmentRepository())


# ── Endpoints ─────────────────────────────────────────────────────────────


@router.get(
    "/",
    summary="List Assignments",
    description="Returns a paginated list of all assignments.",
    response_model=SuccessResponse[AssignmentListResponse],
    response_class=JSONResponse,
)
async def list_assignments(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: AssignmentService = Depends(_get_assignment_service),
) -> JSONResponse:
    logger.debug("list_assignments | user={}", current_user.email)
    result = await service.get_assignments(page=page, page_size=page_size)
    return success_response("Assignments retrieved successfully.", data=result.model_dump())


@router.get(
    "/search",
    summary="Search Assignments",
    description="Returns assignments matching a free-text query.",
    response_model=SuccessResponse[list[AssignmentResponse]],
    response_class=JSONResponse,
)
async def search_assignments(
    query: str = Query(..., min_length=2),
    limit: int = Query(10, ge=1, le=50),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: AssignmentService = Depends(_get_assignment_service),
) -> JSONResponse:
    result = await service.search_assignments(query=query, limit=limit)
    return success_response("Assignments searched successfully.", data=[a.model_dump() for a in result])


@router.post(
    "/filter",
    summary="Filter Assignments",
    description="Returns a paginated list of assignments matching structured filter criteria.",
    response_model=SuccessResponse[AssignmentListResponse],
    response_class=JSONResponse,
)
async def filter_assignments(
    filters: AssignmentFilter,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: AssignmentService = Depends(_get_assignment_service),
) -> JSONResponse:
    result = await service.filter_assignments(filters, page=page, page_size=page_size)
    return success_response("Assignments filtered successfully.", data=result.model_dump())


@router.get(
    "/{assignment_id}",
    summary="Get Assignment",
    description="Returns full details of a single assignment by UUID.",
    response_model=SuccessResponse[AssignmentResponse],
    response_class=JSONResponse,
)
async def get_assignment(
    assignment_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: AssignmentService = Depends(_get_assignment_service),
) -> JSONResponse:
    assignment = await service.get_assignment(assignment_id)
    return success_response("Assignment retrieved successfully.", data=assignment.model_dump())


@router.post(
    "/",
    summary="Create Assignment",
    description="Creates a new asset assignment.",
    response_model=SuccessResponse[AssignmentResponse],
    response_class=JSONResponse,
    status_code=201,
)
async def create_assignment(
    payload: AssignmentCreate,
    current_user: CurrentUser = Depends(require_manager_or_above),
    service: AssignmentService = Depends(_get_assignment_service),
) -> JSONResponse:
    created = await service.create_assignment(payload, assigned_by=current_user.id)
    return created_response("Assignment created successfully.", data=created.model_dump())


@router.put(
    "/{assignment_id}",
    summary="Update Assignment",
    description="Replaces fields of an existing assignment.",
    response_model=SuccessResponse[AssignmentResponse],
    response_class=JSONResponse,
)
async def update_assignment(
    payload: AssignmentUpdate,
    assignment_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_manager_or_above),
    service: AssignmentService = Depends(_get_assignment_service),
) -> JSONResponse:
    updated = await service.update_assignment(assignment_id, payload)
    return success_response("Assignment updated successfully.", data=updated.model_dump())


@router.delete(
    "/{assignment_id}",
    summary="Delete Assignment",
    description="Permanently deletes an assignment. Requires Admin role.",
    response_model=SuccessResponse[None],
    response_class=JSONResponse,
)
async def delete_assignment(
    assignment_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_admin),
    service: AssignmentService = Depends(_get_assignment_service),
) -> JSONResponse:
    await service.delete_assignment(assignment_id)
    return no_content_response("Assignment deleted successfully.")


# ── Workflow Endpoints ────────────────────────────────────────────────────


@router.post(
    "/{assignment_id}/assign",
    summary="Workflow: Assign Asset",
    description="Triggers the assignment workflow event (duplicate of POST /).",
    response_model=SuccessResponse[AssignmentResponse],
    response_class=JSONResponse,
    status_code=200,
)
async def workflow_assign_asset(
    payload: AssignmentCreate,
    assignment_id: UUID = Path(..., description="ID for the new assignment, or ignore if auto-generated"),
    current_user: CurrentUser = Depends(require_manager_or_above),
    service: AssignmentService = Depends(_get_assignment_service),
) -> JSONResponse:
    # Explicitly using the workflow alias
    assigned = await service.assign_asset(payload, assigned_by=current_user.id)
    return success_response("Asset assigned successfully.", data=assigned.model_dump())


@router.post(
    "/{assignment_id}/return",
    summary="Workflow: Return Asset",
    description="Marks an active assignment as returned.",
    response_model=SuccessResponse[AssignmentResponse],
    response_class=JSONResponse,
)
async def workflow_return_asset(
    payload: AssignmentReturn,
    assignment_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_manager_or_above),
    service: AssignmentService = Depends(_get_assignment_service),
) -> JSONResponse:
    returned = await service.return_asset(assignment_id, payload)
    return success_response("Asset returned successfully.", data=returned.model_dump())


@router.post(
    "/{assignment_id}/cancel",
    summary="Workflow: Cancel Assignment",
    description="Cancels an active assignment. Requires Admin role.",
    response_model=SuccessResponse[AssignmentResponse],
    response_class=JSONResponse,
)
async def workflow_cancel_assignment(
    assignment_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_admin),
    service: AssignmentService = Depends(_get_assignment_service),
) -> JSONResponse:
    cancelled = await service.cancel_assignment(assignment_id)
    return success_response("Assignment cancelled successfully.", data=cancelled.model_dump())


@router.get(
    "/{assignment_id}/timeline",
    summary="Assignment Timeline",
    description="Returns the event history of a specific assignment.",
    response_model=SuccessResponse[AssignmentTimelineResponse],
    response_class=JSONResponse,
)
async def get_assignment_timeline(
    assignment_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: AssignmentService = Depends(_get_assignment_service),
) -> JSONResponse:
    timeline = await service.get_assignment_history(assignment_id)
    return success_response("Timeline retrieved successfully.", data=timeline.model_dump())
