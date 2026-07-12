"""
Asset service.

Contains all business logic for the asset resource. The service
layer is the only consumer of the repository interface and the only
producer of domain-level exceptions.

Rules enforced here
-------------------
- An asset code must be unique across all active records.
- Page and page-size parameters are clamped to safe bounds.
- Asset lifecycle status validations.
"""

from typing import List, Optional
from uuid import UUID

from loguru import logger

from app.common.exceptions import (
    BusinessException,
    ResourceNotFoundException,
    ValidationException,
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

# ── Constants ─────────────────────────────────────────────────────────────

_MAX_PAGE_SIZE: int = 100
_DEFAULT_PAGE_SIZE: int = 20
_MIN_SEARCH_LENGTH: int = 2


class AssetService:
    """Orchestrates business operations for the asset resource.

    Args:
        repository: A :class:`~app.repositories.asset_repository.AssetRepository`
            instance injected by the dependency container.
    """

    def __init__(self, repository: AssetRepository) -> None:
        self._repo = repository

    # ── Public interface ──────────────────────────────────────────────────

    async def get_assets(
        self,
        page: int = 1,
        page_size: int = _DEFAULT_PAGE_SIZE,
    ) -> AssetListResponse:
        """Return a paginated list of assets."""
        page, page_size = self._validate_pagination(page, page_size)
        logger.debug("get_assets | page={} page_size={}", page, page_size)
        items, total = await self._repo.get_all(page=page, page_size=page_size)
        return AssetListResponse(items=items, total=total, page=page, page_size=page_size)

    async def get_asset(self, asset_id: UUID) -> AssetResponse:
        """Return a single asset by ID."""
        logger.debug("get_asset | id={}", asset_id)
        asset = await self._repo.get_by_id(asset_id)
        if asset is None:
            raise ResourceNotFoundException(f"Asset with ID '{asset_id}' was not found.")
        return asset

    async def create_asset(self, payload: AssetCreate) -> AssetResponse:
        """Validate and persist a new asset."""
        logger.info("create_asset | code={}", payload.asset_code)
        await self._assert_code_is_unique(payload.asset_code)
        
        created = await self._repo.create(payload)
        logger.info("Asset created | id={} code={}", created.id, created.asset_code)
        return created

    async def update_asset(
        self,
        asset_id: UUID,
        payload: AssetUpdate,
    ) -> AssetResponse:
        """Validate and replace an existing asset."""
        logger.info("update_asset | id={} code={}", asset_id, payload.asset_code)
        await self._assert_exists(asset_id)
        await self._assert_code_is_unique(payload.asset_code, exclude_id=asset_id)
        
        updated = await self._repo.update(asset_id, payload)
        logger.info("Asset updated | id={}", asset_id)
        return updated

    async def delete_asset(self, asset_id: UUID) -> None:
        """Remove an asset."""
        logger.info("delete_asset | id={}", asset_id)
        await self._assert_exists(asset_id)
        await self._repo.delete(asset_id)
        logger.info("Asset deleted | id={}", asset_id)

    async def search_assets(
        self,
        query: str,
        limit: int = 10,
    ) -> List[AssetResponse]:
        """Search assets by code, name, or serial number."""
        if not query or len(query.strip()) < _MIN_SEARCH_LENGTH:
            raise ValidationException(
                f"Search query must be at least {_MIN_SEARCH_LENGTH} characters long."
            )
        
        logger.debug("search_assets | query={} limit={}", query, limit)
        return await self._repo.search(query.strip(), limit=limit)

    async def filter_assets(
        self,
        filters: AssetFilter,
        page: int = 1,
        page_size: int = _DEFAULT_PAGE_SIZE,
    ) -> AssetListResponse:
        """Filter assets by specific criteria."""
        page, page_size = self._validate_pagination(page, page_size)
        logger.debug("filter_assets | filters={} page={}", filters, page)
        
        items, total = await self._repo.filter(filters, page=page, page_size=page_size)
        return AssetListResponse(items=items, total=total, page=page, page_size=page_size)

    async def change_asset_status(
        self,
        asset_id: UUID,
        status: AssetStatus,
    ) -> AssetResponse:
        """Update the lifecycle status of an asset."""
        logger.info("change_asset_status | id={} new_status={}", asset_id, status)
        await self._assert_exists(asset_id)
        
        updated = await self._repo.change_status(asset_id, status)
        logger.info("Asset status updated | id={} status={}", asset_id, status)
        return updated

    # ── Private helpers ───────────────────────────────────────────────────

    def _validate_pagination(
        self,
        page: int,
        page_size: int,
    ) -> tuple[int, int]:
        """Clamp pagination parameters to safe bounds."""
        if page < 1:
            raise ValidationException("Page number must be greater than or equal to 1.")
        if page_size < 1:
            raise ValidationException("Page size must be greater than or equal to 1.")

        page_size = min(page_size, _MAX_PAGE_SIZE)
        return page, page_size

    async def _assert_exists(self, asset_id: UUID) -> None:
        """Raise ResourceNotFoundException when the asset does not exist."""
        if not await self._repo.exists(asset_id):
            raise ResourceNotFoundException(f"Asset with ID '{asset_id}' was not found.")

    async def _assert_code_is_unique(
        self,
        code: str,
        exclude_id: Optional[UUID] = None,
    ) -> None:
        """Raise BusinessException when *code* is already taken."""
        results = await self._repo.search(code, limit=10)
        for ast in results:
            if ast.asset_code == code and ast.id != exclude_id:
                raise BusinessException(
                    f"An asset with code '{code}' already exists. "
                    "Asset codes must be unique."
                )
