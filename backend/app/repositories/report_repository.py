"""
Report repository interface.
"""

from typing import Any, List

from app.schemas.report import (
    AssetReport,
    AssignmentReport,
    CategoryReport,
    MaintenanceReport,
    ReportFilter,
    ReportStatistics,
    ReportSummary,
    ReportTrend,
)


class ReportRepository:
    """Abstract repository for fetching report data aggregates."""

    async def get_asset_report(self, filters: ReportFilter) -> List[AssetReport]:
        """Fetch asset-specific report rows."""
        raise NotImplementedError

    async def get_assignment_report(self, filters: ReportFilter) -> List[AssignmentReport]:
        """Fetch assignment-specific report rows."""
        raise NotImplementedError

    async def get_maintenance_report(self, filters: ReportFilter) -> List[MaintenanceReport]:
        """Fetch maintenance-specific report rows."""
        raise NotImplementedError

    async def get_category_report(self, filters: ReportFilter) -> List[CategoryReport]:
        """Fetch category-specific report rows."""
        raise NotImplementedError

    async def get_statistics(self, filters: ReportFilter) -> ReportStatistics:
        """Fetch overall report statistics based on filters."""
        raise NotImplementedError

    async def get_trends(self, filters: ReportFilter) -> List[ReportTrend]:
        """Fetch trending data for reports."""
        raise NotImplementedError

    async def export_data(self, filters: ReportFilter) -> List[dict[str, Any]]:
        """Fetch raw flat dictionary data suitable for file export."""
        raise NotImplementedError
