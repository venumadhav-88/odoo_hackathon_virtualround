"""
Dashboard & Analytics query service.
"""

from typing import List

from loguru import logger

from app.common.service import BaseService
from app.repositories.dashboard_repository import DashboardRepository
from app.schemas.dashboard import (
    AssetStatistics,
    AssignmentStatistics,
    CategoryStatistics,
    DashboardSummary,
    MaintenanceStatistics,
    RecentActivity,
    TrendMetric,
)


class DashboardService(BaseService):
    """Business logic layer for retrieving and aggregating dashboard metrics."""

    def __init__(self, repository: DashboardRepository) -> None:
        # BaseService expects a repository, but this repo doesn't map to a generic CRUD entity.
        # It still serves as the data access layer.
        super().__init__(repository)
        self._repo: DashboardRepository = repository

    async def get_dashboard_summary(self) -> DashboardSummary:
        """Retrieve the top-level dashboard summary."""
        logger.debug("get_dashboard_summary")
        return await self._repo.get_dashboard_summary()

    async def get_asset_statistics(self) -> AssetStatistics:
        """Retrieve aggregated asset statistics."""
        logger.debug("get_asset_statistics")
        return await self._repo.get_asset_statistics()

    async def get_assignment_statistics(self) -> AssignmentStatistics:
        """Retrieve aggregated assignment statistics."""
        logger.debug("get_assignment_statistics")
        return await self._repo.get_assignment_statistics()

    async def get_maintenance_statistics(self) -> MaintenanceStatistics:
        """Retrieve aggregated maintenance statistics."""
        logger.debug("get_maintenance_statistics")
        return await self._repo.get_maintenance_statistics()

    async def get_category_statistics(self) -> CategoryStatistics:
        """Retrieve aggregated category statistics."""
        logger.debug("get_category_statistics")
        return await self._repo.get_category_statistics()

    async def get_recent_activities(self, limit: int = 10) -> List[RecentActivity]:
        """Retrieve a list of recent activities."""
        logger.debug("get_recent_activities | limit={}", limit)
        return await self._repo.get_recent_activity(limit=limit)

    async def get_trends(self) -> List[TrendMetric]:
        """Retrieve platform trends."""
        logger.debug("get_trends")
        return await self._repo.get_trends()
