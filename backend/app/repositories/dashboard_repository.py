"""
Dashboard repository interface.

Provides abstract data-access methods for cross-module metric aggregation.
"""

from typing import List

from app.schemas.dashboard import (
    AssetStatistics,
    AssignmentStatistics,
    CategoryStatistics,
    DashboardSummary,
    MaintenanceStatistics,
    RecentActivity,
    TrendMetric,
)


class DashboardRepository:
    """Abstract repository for dashboard and analytics metrics."""

    async def get_dashboard_summary(self) -> DashboardSummary:
        """Fetch high-level dashboard aggregate summary."""
        raise NotImplementedError

    async def get_asset_statistics(self) -> AssetStatistics:
        """Fetch asset-related statistics."""
        raise NotImplementedError

    async def get_assignment_statistics(self) -> AssignmentStatistics:
        """Fetch assignment-related statistics."""
        raise NotImplementedError

    async def get_maintenance_statistics(self) -> MaintenanceStatistics:
        """Fetch maintenance-related statistics."""
        raise NotImplementedError

    async def get_category_statistics(self) -> CategoryStatistics:
        """Fetch category-related statistics."""
        raise NotImplementedError

    async def get_recent_activity(self, limit: int = 10) -> List[RecentActivity]:
        """Fetch a list of recent activities across the platform."""
        raise NotImplementedError

    async def get_trends(self) -> List[TrendMetric]:
        """Fetch trend metrics across the platform."""
        raise NotImplementedError
