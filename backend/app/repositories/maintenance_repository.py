"""
Maintenance repository interface.
"""

from typing import List
from uuid import UUID

from app.common.repository import BaseRepository
from app.schemas.maintenance import (
    MaintenanceComplete,
    MaintenanceCreate,
    MaintenanceFilter,
    MaintenanceResponse,
    MaintenanceUpdate,
)


class MaintenanceRepository(
    BaseRepository[MaintenanceResponse, MaintenanceCreate, MaintenanceUpdate, UUID]
):
    """Abstract repository for maintenance logs."""

    async def search(
        self,
        query: str,
        limit: int = 10,
    ) -> List[MaintenanceResponse]:
        """Search maintenance tasks by description or technician name."""
        raise NotImplementedError

    async def filter(
        self,
        filters: MaintenanceFilter,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[List[MaintenanceResponse], int]:
        """Filter maintenance tasks by structured criteria."""
        raise NotImplementedError

    async def schedule(self, payload: MaintenanceCreate) -> MaintenanceResponse:
        """Alias for creating a new scheduled maintenance task."""
        raise NotImplementedError

    async def start(self, maintenance_id: UUID) -> MaintenanceResponse:
        """Mark a maintenance task as started."""
        raise NotImplementedError

    async def complete(
        self, 
        maintenance_id: UUID, 
        payload: MaintenanceComplete
    ) -> MaintenanceResponse:
        """Mark a maintenance task as completed with actual costs."""
        raise NotImplementedError

    async def cancel(self, maintenance_id: UUID) -> MaintenanceResponse:
        """Mark a maintenance task as cancelled."""
        raise NotImplementedError

    async def get_history(self, maintenance_id: UUID) -> List[dict]:
        """Retrieve the timeline events of a maintenance task."""
        raise NotImplementedError
