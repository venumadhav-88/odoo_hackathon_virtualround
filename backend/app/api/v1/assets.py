"""
Assets API router — /api/v1/assets

Responsibilities of this module
--------------------------------
1. Declare HTTP routes and document them for Swagger/ReDoc.
2. Validate and parse incoming request data (delegated to Pydantic).
3. Resolve dependencies (auth, service).
4. Delegate all business logic to :class:`~app.services.asset_service.AssetService`.
5. Return standardised response envelopes via the response builders.

No business logic lives here.
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
from app.repositories.asset_repository import AssetRepository
from app.schemas.asset import (
    AssetCreate,
    AssetFilter,
    AssetListResponse,
    AssetResponse,
    AssetStatus,
    AssetUpdate,
)
from app.schemas.user import CurrentUser
from app.services.asset_service import AssetService

# ── Router ────────────────────────────────────────────────────────────────

router = APIRouter(prefix="/assets", tags=["Assets"])


# ── Dependency: resolve the service with its repository ───────────────────


def _get_asset_service() -> AssetService:
    """Construct and return an AssetService with its repository.

    Swapping the repository implementation in a future phase requires
    only this function to change.
    """
    return AssetService(repository=AssetRepository())


# ── Endpoints ─────────────────────────────────────────────────────────────


@router.get(
    "/",
    summary="List Assets",
    description="Returns a paginated list of all assets.",
    response_model=SuccessResponse[AssetListResponse],
    response_class=JSONResponse,
    status_code=200,
)
async def list_assets(
    page: int = Query(1, ge=1, description="1-based page number."),
    page_size: int = Query(20, ge=1, le=100, description="Records per page."),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: AssetService = Depends(_get_asset_service),
) -> JSONResponse:
    """Return a paginated list of assets."""
    logger.debug("list_assets | user={}", current_user.email)
    result = await service.get_assets(page=page, page_size=page_size)
    return success_response(
        message="Assets retrieved successfully.",
        data=result.model_dump(),
    )


@router.get(
    "/search",
    summary="Search Assets",
    description="Returns assets matching a free-text query (name, code, serial number).",
    response_model=SuccessResponse[list[AssetResponse]],
    response_class=JSONResponse,
    status_code=200,
)
async def search_assets(
    query: str = Query(..., min_length=2, description="Search term."),
    limit: int = Query(10, ge=1, le=50, description="Max results."),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: AssetService = Depends(_get_asset_service),
) -> JSONResponse:
    """Return assets matching a search query."""
    logger.debug("search_assets | user={} query={}", current_user.email, query)
    result = await service.search_assets(query=query, limit=limit)
    return success_response(
        message="Assets searched successfully.",
        data=[ast.model_dump() for ast in result],
    )


@router.post(
    "/filter",
    summary="Filter Assets",
    description="Returns a paginated list of assets matching structured filter criteria.",
    response_model=SuccessResponse[AssetListResponse],
    response_class=JSONResponse,
    status_code=200,
)
async def filter_assets(
    filters: AssetFilter,
    page: int = Query(1, ge=1, description="1-based page number."),
    page_size: int = Query(20, ge=1, le=100, description="Records per page."),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: AssetService = Depends(_get_asset_service),
) -> JSONResponse:
    """Return a paginated, filtered list of assets."""
    logger.debug("filter_assets | user={}", current_user.email)
    result = await service.filter_assets(filters, page=page, page_size=page_size)
    return success_response(
        message="Assets filtered successfully.",
        data=result.model_dump(),
    )


@router.get(
    "/{asset_id}",
    summary="Get Asset",
    description="Returns full details of a single asset by UUID.",
    response_model=SuccessResponse[AssetResponse],
    response_class=JSONResponse,
    status_code=200,
)
async def get_asset(
    asset_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: AssetService = Depends(_get_asset_service),
) -> JSONResponse:
    """Return a single asset by ID."""
    logger.debug("get_asset | id={} user={}", asset_id, current_user.email)
    asset = await service.get_asset(asset_id)
    return success_response(
        message="Asset retrieved successfully.",
        data=asset.model_dump(),
    )


@router.post(
    "/",
    summary="Create Asset",
    description="Creates a new asset. Asset code must be unique.",
    response_model=SuccessResponse[AssetResponse],
    response_class=JSONResponse,
    status_code=201,
)
async def create_asset(
    payload: AssetCreate,
    current_user: CurrentUser = Depends(require_manager_or_above),
    service: AssetService = Depends(_get_asset_service),
) -> JSONResponse:
    """Create a new asset and return the persisted record."""
    logger.info("create_asset | code={} user={}", payload.asset_code, current_user.email)
    created = await service.create_asset(payload)
    return created_response(
        message="Asset created successfully.",
        data=created.model_dump(),
    )


@router.put(
    "/{asset_id}",
    summary="Update Asset",
    description="Replaces all fields of an existing asset.",
    response_model=SuccessResponse[AssetResponse],
    response_class=JSONResponse,
    status_code=200,
)
async def update_asset(
    payload: AssetUpdate,
    asset_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_manager_or_above),
    service: AssetService = Depends(_get_asset_service),
) -> JSONResponse:
    """Replace an existing asset's data and return the updated record."""
    logger.info("update_asset | id={} user={}", asset_id, current_user.email)
    updated = await service.update_asset(asset_id, payload)
    return success_response(
        message="Asset updated successfully.",
        data=updated.model_dump(),
    )


@router.patch(
    "/{asset_id}/status",
    summary="Change Asset Status",
    description="Atomically updates only the lifecycle status of an asset.",
    response_model=SuccessResponse[AssetResponse],
    response_class=JSONResponse,
    status_code=200,
)
async def change_asset_status(
    status: AssetStatus = Body(..., embed=True),
    asset_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_manager_or_above),
    service: AssetService = Depends(_get_asset_service),
) -> JSONResponse:
    """Update the lifecycle status of an asset."""
    logger.info("change_asset_status | id={} status={} user={}", asset_id, status, current_user.email)
    updated = await service.change_asset_status(asset_id, status)
    return success_response(
        message="Asset status updated successfully.",
        data=updated.model_dump(),
    )


@router.delete(
    "/{asset_id}",
    summary="Delete Asset",
    description="Permanently deletes an asset. Requires Admin role.",
    response_model=SuccessResponse[None],
    response_class=JSONResponse,
    status_code=200,
)
async def delete_asset(
    asset_id: UUID = Path(...),
    current_user: CurrentUser = Depends(require_admin),
    service: AssetService = Depends(_get_asset_service),
) -> JSONResponse:
    """Delete an asset."""
    logger.info("delete_asset | id={} user={}", asset_id, current_user.email)
    await service.delete_asset(asset_id)
    return no_content_response("Asset deleted successfully.")
