"""
Asset repository interface.

Defines the contract that any concrete data-access implementation must
satisfy for the asset domain. All methods raise NotImplementedError
until a concrete driver (e.g. Supabase, SQLAlchemy) is injected.
"""

from typing import List, Optional
from uuid import UUID

from app.schemas.asset import (
    AssetCreate,
    AssetFilter,
    AssetResponse,
    AssetStatus,
    AssetUpdate,
)


class AssetRepository:
    """Abstract repository defining data-access operations for assets."""

    async def get_all(
        self,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[List[AssetResponse], int]:
        """Return a paginated list of all assets.

        Args:
            page: 1-based page number.
            page_size: Maximum records per page.

        Returns:
            A tuple of ``(items, total_count)``.
        """
        raise NotImplementedError

    async def get_by_id(self, asset_id: UUID) -> Optional[AssetResponse]:
        """Return a single asset by its primary key, or ``None``."""
        raise NotImplementedError

    async def create(self, payload: AssetCreate) -> AssetResponse:
        """Persist a new asset and return the created record."""
        raise NotImplementedError

    async def update(
        self,
        asset_id: UUID,
        payload: AssetUpdate,
    ) -> AssetResponse:
        """Replace an existing asset's fields and return the updated record."""
        raise NotImplementedError

    async def delete(self, asset_id: UUID) -> None:
        """Permanently remove an asset record."""
        raise NotImplementedError

    async def exists(self, asset_id: UUID) -> bool:
        """Return True when an asset with the given ID exists."""
        raise NotImplementedError

    async def search(
        self,
        query: str,
        limit: int = 10,
    ) -> List[AssetResponse]:
        """Return assets whose code, name, or serial number match *query*."""
        raise NotImplementedError

    async def filter(
        self,
        filters: AssetFilter,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[List[AssetResponse], int]:
        """Return assets matching specific filter criteria.

        Args:
            filters: Structured filter constraints (category, status, etc.).
            page: 1-based page number.
            page_size: Maximum records per page.

        Returns:
            A tuple of ``(items, total_count)``.
        """
        raise NotImplementedError

    async def change_status(
        self,
        asset_id: UUID,
        status: AssetStatus,
    ) -> AssetResponse:
        """Atomically update only the status field of an asset."""
        raise NotImplementedError
