"""
Asset Assignment service.

Contains all business logic for assignments.
"""

from typing import List
from uuid import UUID

from loguru import logger

from app.common.exceptions import (
    BusinessException,
    ResourceNotFoundException,
    ValidationException,
)
from app.common.service import BaseService
from app.repositories.assignment_repository import AssignmentRepository
from app.schemas.assignment import (
    AssignmentCreate,
    AssignmentFilter,
    AssignmentListResponse,
    AssignmentResponse,
    AssignmentReturn,
    AssignmentStatus,
    AssignmentTimelineResponse,
    AssignmentUpdate,
)

_MIN_SEARCH_LENGTH: int = 2


class AssignmentService(BaseService):
    """Orchestrates business operations for asset assignments."""

    def __init__(self, repository: AssignmentRepository) -> None:
        super().__init__(repository)
        self._repo: AssignmentRepository = repository

    # ── Public interface ──────────────────────────────────────────────────

    async def get_assignments(
        self,
        page: int = 1,
        page_size: int = 20,
    ) -> AssignmentListResponse:
        """Return a paginated list of assignments."""
        page, page_size = self._validate_pagination(page, page_size)
        logger.debug("get_assignments | page={} page_size={}", page, page_size)
        items, total = await self._repo.get_all(page=page, page_size=page_size)
        return AssignmentListResponse(items=items, total=total, page=page, page_size=page_size)

    async def get_assignment(self, assignment_id: UUID) -> AssignmentResponse:
        """Return a single assignment by ID."""
        logger.debug("get_assignment | id={}", assignment_id)
        assignment = await self._repo.get_by_id(assignment_id)
        if assignment is None:
            raise ResourceNotFoundException(f"Assignment with ID '{assignment_id}' was not found.")
        return assignment

    async def create_assignment(
        self,
        payload: AssignmentCreate,
        assigned_by: UUID,
    ) -> AssignmentResponse:
        """Alias for assign_asset."""
        return await self.assign_asset(payload, assigned_by)

    async def update_assignment(
        self,
        assignment_id: UUID,
        payload: AssignmentUpdate,
    ) -> AssignmentResponse:
        """Update an existing assignment's details."""
        logger.info("update_assignment | id={}", assignment_id)
        await self._assert_exists(assignment_id)
        updated = await self._repo.update(assignment_id, payload)
        return updated

    async def delete_assignment(self, assignment_id: UUID) -> None:
        """Remove an assignment permanently."""
        logger.info("delete_assignment | id={}", assignment_id)
        await self._assert_exists(assignment_id)
        await self._repo.delete(assignment_id)
        logger.info("Assignment deleted | id={}", assignment_id)

    async def search_assignments(
        self,
        query: str,
        limit: int = 10,
    ) -> List[AssignmentResponse]:
        """Search assignments."""
        if not query or len(query.strip()) < _MIN_SEARCH_LENGTH:
            raise ValidationException(
                f"Search query must be at least {_MIN_SEARCH_LENGTH} characters long."
            )
        logger.debug("search_assignments | query={} limit={}", query, limit)
        return await self._repo.search(query.strip(), limit=limit)

    async def filter_assignments(
        self,
        filters: AssignmentFilter,
        page: int = 1,
        page_size: int = 20,
    ) -> AssignmentListResponse:
        """Filter assignments by specific criteria."""
        page, page_size = self._validate_pagination(page, page_size)
        logger.debug("filter_assignments | filters={} page={}", filters, page)
        items, total = await self._repo.filter(filters, page=page, page_size=page_size)
        return AssignmentListResponse(items=items, total=total, page=page, page_size=page_size)

    # ── Workflow operations ───────────────────────────────────────────────

    async def assign_asset(
        self,
        payload: AssignmentCreate,
        assigned_by: UUID,
    ) -> AssignmentResponse:
        """Assign an asset to an employee."""
        logger.info("assign_asset | asset={} employee={}", payload.asset_id, payload.employee_id)
        
        # Prevent assigning an asset that is already actively assigned
        active = await self._repo.get_active_assignment_for_asset(payload.asset_id)
        if active:
            raise BusinessException(
                f"Asset {payload.asset_id} is already actively assigned to another employee."
            )
        
        created = await self._repo.assign_asset(payload, assigned_by)
        return created

    async def return_asset(
        self,
        assignment_id: UUID,
        payload: AssignmentReturn,
    ) -> AssignmentResponse:
        """Return an active assignment."""
        logger.info("return_asset | id={}", assignment_id)
        assignment = await self.get_assignment(assignment_id)

        if assignment.status == AssignmentStatus.RETURNED:
            raise BusinessException("This assignment has already been returned.")
        if assignment.status == AssignmentStatus.CANCELLED:
            raise BusinessException("Cannot return a cancelled assignment.")

        return await self._repo.return_asset(assignment_id, payload)

    async def cancel_assignment(
        self,
        assignment_id: UUID,
    ) -> AssignmentResponse:
        """Cancel an active assignment."""
        logger.info("cancel_assignment | id={}", assignment_id)
        assignment = await self.get_assignment(assignment_id)

        if assignment.status == AssignmentStatus.CANCELLED:
            raise BusinessException("This assignment is already cancelled.")
        if assignment.status == AssignmentStatus.RETURNED:
            raise BusinessException("Cannot cancel a completed/returned assignment.")

        return await self._repo.cancel_assignment(assignment_id)

    async def get_assignment_history(
        self,
        assignment_id: UUID,
    ) -> AssignmentTimelineResponse:
        """Return timeline events for an assignment."""
        logger.debug("get_assignment_history | id={}", assignment_id)
        await self._assert_exists(assignment_id)
        return await self._repo.get_assignment_history(assignment_id)

    # ── Private helpers ───────────────────────────────────────────────────

    async def _assert_exists(self, assignment_id: UUID) -> None:
        if not await self._repo.exists(assignment_id):
            raise ResourceNotFoundException(f"Assignment with ID '{assignment_id}' was not found.")
