"""
Asset assignment repository interface.

Defines the contract that any concrete data-access implementation must
satisfy for the assignment domain.
"""

from typing import List, Optional
from uuid import UUID

from app.common.repository import BaseRepository
from app.schemas.assignment import (
    AssignmentCreate,
    AssignmentFilter,
    AssignmentResponse,
    AssignmentReturn,
    AssignmentStatus,
    AssignmentTimelineResponse,
    AssignmentUpdate,
)


class AssignmentRepository(
    BaseRepository[AssignmentResponse, AssignmentCreate, AssignmentUpdate, UUID]
):
    """Abstract repository for asset assignments."""

    async def search(
        self,
        query: str,
        limit: int = 10,
    ) -> List[AssignmentResponse]:
        """Return assignments matching a free-text search (e.g. employee name, asset code)."""
        raise NotImplementedError

    async def filter(
        self,
        filters: AssignmentFilter,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[List[AssignmentResponse], int]:
        """Return assignments matching specific filter criteria."""
        raise NotImplementedError

    async def get_active_assignment_for_asset(self, asset_id: UUID) -> Optional[AssignmentResponse]:
        """Return the active assignment for an asset, if any."""
        raise NotImplementedError

    async def assign_asset(
        self,
        payload: AssignmentCreate,
        assigned_by: UUID,
    ) -> AssignmentResponse:
        """Create a new active assignment."""
        raise NotImplementedError

    async def return_asset(
        self,
        assignment_id: UUID,
        payload: AssignmentReturn,
    ) -> AssignmentResponse:
        """Mark an assignment as returned and capture condition details."""
        raise NotImplementedError

    async def cancel_assignment(
        self,
        assignment_id: UUID,
    ) -> AssignmentResponse:
        """Mark an assignment as cancelled."""
        raise NotImplementedError

    async def get_assignment_history(
        self,
        assignment_id: UUID,
    ) -> AssignmentTimelineResponse:
        """Return the timeline events for a specific assignment."""
        raise NotImplementedError
