"""
Categories API router — /api/v1/categories

Responsibilities of this module
--------------------------------
1. Declare HTTP routes and document them for Swagger/ReDoc.
2. Validate and parse incoming request data (delegated to Pydantic).
3. Resolve dependencies (auth, service).
4. Delegate all business logic to :class:`~app.services.category_service.CategoryService`.
5. Return standardised response envelopes via the response builders.

No business logic lives here.
"""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from loguru import logger

from app.common.responses import (
    SuccessResponse,
    created_response,
    no_content_response,
    success_response,
)
from app.dependencies.auth import (
    require_any_authenticated_role,
    require_manager_or_above,
)
from app.repositories.category_repository import CategoryRepository
from app.schemas.category import (
    CategoryCreate,
    CategoryFilter,
    CategoryListResponse,
    CategoryResponse,
    CategoryStatus,
    CategoryUpdate,
)
from app.schemas.user import CurrentUser
from app.services.category_service import CategoryService

# ── Router ────────────────────────────────────────────────────────────────

router = APIRouter(prefix="/categories", tags=["Categories"])


# ── Dependency: resolve the service with its repository ───────────────────


def _get_category_service() -> CategoryService:
    """Construct and return a CategoryService with its repository.

    Swapping the repository implementation in Phase B4 requires only this
    function to change — no router code is affected.
    """
    return CategoryService(repository=CategoryRepository())


# ── Endpoints ─────────────────────────────────────────────────────────────


@router.get(
    "/",
    summary="List Categories",
    description=(
        "Returns a paginated list of asset categories. "
        "Supports optional filtering by name/code search term and status. "
        "Accessible by all authenticated roles."
    ),
    response_model=SuccessResponse[CategoryListResponse],
    response_class=JSONResponse,
    status_code=200,
)
async def list_categories(
    search: Optional[str] = Query(None, max_length=100, description="Search by name or code."),
    status: Optional[CategoryStatus] = Query(None, description="Filter by status."),
    page: int = Query(1, ge=1, description="1-based page number."),
    page_size: int = Query(20, ge=1, le=100, description="Records per page."),
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: CategoryService = Depends(_get_category_service),
) -> JSONResponse:
    """Return a paginated, optionally filtered list of categories."""
    logger.debug("list_categories | user={}", current_user.email)
    filters = CategoryFilter(search=search, status=status)
    result = await service.get_categories(filters, page=page, page_size=page_size)
    return success_response(
        message="Categories retrieved successfully.",
        data=result.model_dump(),
    )


@router.get(
    "/{category_id}",
    summary="Get Category",
    description=(
        "Returns the full details of a single category identified by its UUID. "
        "Accessible by all authenticated roles."
    ),
    response_model=SuccessResponse[CategoryResponse],
    response_class=JSONResponse,
    status_code=200,
)
async def get_category(
    category_id: UUID,
    current_user: CurrentUser = Depends(require_any_authenticated_role),
    service: CategoryService = Depends(_get_category_service),
) -> JSONResponse:
    """Return a single category by ID."""
    logger.debug("get_category | id={} user={}", category_id, current_user.email)
    category = await service.get_category(category_id)
    return success_response(
        message="Category retrieved successfully.",
        data=category.model_dump(),
    )


@router.post(
    "/",
    summary="Create Category",
    description=(
        "Creates a new asset category. The category code must be unique. "
        "Requires Manager or Admin role."
    ),
    response_model=SuccessResponse[CategoryResponse],
    response_class=JSONResponse,
    status_code=201,
)
async def create_category(
    payload: CategoryCreate,
    current_user: CurrentUser = Depends(require_manager_or_above),
    service: CategoryService = Depends(_get_category_service),
) -> JSONResponse:
    """Create a new category and return the persisted record."""
    logger.info("create_category | code={} user={}", payload.code, current_user.email)
    created = await service.create_category(payload)
    return created_response(
        message="Category created successfully.",
        data=created.model_dump(),
    )


@router.put(
    "/{category_id}",
    summary="Update Category",
    description=(
        "Replaces all fields of an existing category. "
        "The new code must be unique (excluding the current record). "
        "Requires Manager or Admin role."
    ),
    response_model=SuccessResponse[CategoryResponse],
    response_class=JSONResponse,
    status_code=200,
)
async def update_category(
    category_id: UUID,
    payload: CategoryUpdate,
    current_user: CurrentUser = Depends(require_manager_or_above),
    service: CategoryService = Depends(_get_category_service),
) -> JSONResponse:
    """Replace an existing category's data and return the updated record."""
    logger.info("update_category | id={} user={}", category_id, current_user.email)
    updated = await service.update_category(category_id, payload)
    return success_response(
        message="Category updated successfully.",
        data=updated.model_dump(),
    )


@router.delete(
    "/{category_id}",
    summary="Delete Category",
    description=(
        "Permanently deletes a category. The operation is rejected when the "
        "category still has assets assigned to it. "
        "Requires Manager or Admin role."
    ),
    response_model=SuccessResponse[None],
    response_class=JSONResponse,
    status_code=200,
)
async def delete_category(
    category_id: UUID,
    current_user: CurrentUser = Depends(require_manager_or_above),
    service: CategoryService = Depends(_get_category_service),
) -> JSONResponse:
    """Delete a category if it has no associated assets."""
    logger.info("delete_category | id={} user={}", category_id, current_user.email)
    await service.delete_category(category_id)
    return no_content_response("Category deleted successfully.")
