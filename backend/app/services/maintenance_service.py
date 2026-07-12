"""
Maintenance service.
"""

from datetime import date
from typing import List
from uuid import UUID

from loguru import logger

from app.common.exceptions import ResourceNotFoundException, ValidationException
from app.common.service import BaseService
from app.repositories.maintenance_repository import MaintenanceRepository
from app.schemas.maintenance import (
    MaintenanceComplete,
    MaintenanceCreate,
    MaintenanceFilter,
    MaintenanceListResponse,
    MaintenanceResponse,
    MaintenanceUpdate,
)
from app.validators.maintenance_validator import MaintenanceValidator


_MIN_SEARCH_LENGTH: int = 2


class MaintenanceService(BaseService):
    """Orchestrates business operations for maintenance tasks."""

    def __init__(self, repository: MaintenanceRepository) -> None:
        super().__init__(repository)
        self._repo: MaintenanceRepository = repository
        self._validator = MaintenanceValidator()

    # ── Public interface ──────────────────────────────────────────────────

    async def get_maintenances(
        self,
        page: int = 1,
        page_size: int = 20,
    ) -> MaintenanceListResponse:
        """Return a paginated list of maintenance logs."""
        page, page_size = self._validate_pagination(page, page_size)
        logger.debug("get_maintenances | page={} page_size={}", page, page_size)
        items, total = await self._repo.get_all(page=page, page_size=page_size)
        return MaintenanceListResponse(items=items, total=total, page=page, page_size=page_size)

    async def get_maintenance(self, maintenance_id: UUID) -> MaintenanceResponse:
        """Return a single maintenance task by ID."""
        logger.debug("get_maintenance | id={}", maintenance_id)
        record = await self._repo.get_by_id(maintenance_id)
        if record is None:
            raise ResourceNotFoundException(f"Maintenance task '{maintenance_id}' not found.")
        return record

    async def create_maintenance(self, payload: MaintenanceCreate) -> MaintenanceResponse:
        """Alias for scheduling a maintenance task."""
        return await self.schedule(payload)

    async def update_maintenance(
        self,
        maintenance_id: UUID,
        payload: MaintenanceUpdate,
    ) -> MaintenanceResponse:
        """Update an existing scheduled maintenance task."""
        logger.info("update_maintenance | id={}", maintenance_id)
        await self._assert_exists(maintenance_id)
        # Note: Validation for updating dates vs current status could be added here
        # but is omitted unless specifically requested. Standard repo update applies.
        return await self._repo.update(maintenance_id, payload)

    async def delete_maintenance(self, maintenance_id: UUID) -> None:
        """Permanently remove a maintenance record."""
        logger.info("delete_maintenance | id={}", maintenance_id)
        await self._assert_exists(maintenance_id)
        await self._repo.delete(maintenance_id)

    async def search(
        self,
        query: str,
        limit: int = 10,
    ) -> List[MaintenanceResponse]:
        """Search maintenance records by description or technician."""
        if not query or len(query.strip()) < _MIN_SEARCH_LENGTH:
            raise ValidationException(f"Search query must be at least {_MIN_SEARCH_LENGTH} characters.")
        
        logger.debug("search_maintenances | query={} limit={}", query, limit)
        return await self._repo.search(query.strip(), limit=limit)

    async def filter(
        self,
        filters: MaintenanceFilter,
        page: int = 1,
        page_size: int = 20,
    ) -> MaintenanceListResponse:
        """Filter maintenance tasks by structured criteria."""
        page, page_size = self._validate_pagination(page, page_size)
        logger.debug("filter_maintenances | filters={} page={}", filters, page)
        items, total = await self._repo.filter(filters, page=page, page_size=page_size)
        return MaintenanceListResponse(items=items, total=total, page=page, page_size=page_size)

    # ── Workflow operations ───────────────────────────────────────────────

    async def schedule(self, payload: MaintenanceCreate) -> MaintenanceResponse:
        """Schedule a new maintenance task."""
        logger.info("schedule_maintenance | asset={}", payload.asset_id)
        return await self._repo.schedule(payload)

    async def start(self, maintenance_id: UUID) -> MaintenanceResponse:
        """Mark a task as in progress."""
        logger.info("start_maintenance | id={}", maintenance_id)
        task = await self.get_maintenance(maintenance_id)
        
        today = date.today()
        self._validator.validate_start_transition(task.status, today, task.scheduled_date)
        
        return await self._repo.start(maintenance_id)

    async def complete(
        self, 
        maintenance_id: UUID, 
        payload: MaintenanceComplete
    ) -> MaintenanceResponse:
        """Mark a task as completed."""
        logger.info("complete_maintenance | id={}", maintenance_id)
        task = await self.get_maintenance(maintenance_id)
        
        self._validator.validate_complete_transition(task.status, payload.completion_date, task.start_date)
        
        return await self._repo.complete(maintenance_id, payload)

    async def cancel(self, maintenance_id: UUID) -> MaintenanceResponse:
        """Cancel a maintenance task."""
        logger.info("cancel_maintenance | id={}", maintenance_id)
        task = await self.get_maintenance(maintenance_id)
        
        self._validator.validate_cancel_transition(task.status)
        
        return await self._repo.cancel(maintenance_id)

    async def history(self, maintenance_id: UUID) -> List[dict]:
        """Get the timeline history of a maintenance task."""
        logger.debug("maintenance_history | id={}", maintenance_id)
        await self._assert_exists(maintenance_id)
        return await self._repo.get_history(maintenance_id)

    # ── Private helpers ───────────────────────────────────────────────────

    async def _assert_exists(self, maintenance_id: UUID) -> None:
        if not await self._repo.exists(maintenance_id):
            raise ResourceNotFoundException(f"Maintenance task '{maintenance_id}' was not found.")
