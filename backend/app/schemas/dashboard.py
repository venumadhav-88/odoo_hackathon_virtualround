"""
Dashboard & Analytics schemas.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class StatisticCard(BaseModel):
    """A generic statistic card metric."""

    label: str
    value: int | float | str
    change_percentage: Optional[float] = None
    trend_direction: Optional[str] = None  # e.g., 'up', 'down', 'neutral'


class SummaryMetrics(BaseModel):
    """Top-level aggregate metrics."""

    total_assets: int
    active_assignments: int
    pending_maintenance: int
    total_categories: int


class ChartPoint(BaseModel):
    """A single point in a chart series."""

    x: str  # Usually date/time or category label
    y: float | int


class ChartSeries(BaseModel):
    """A data series for rendering charts."""

    name: str
    data: List[ChartPoint]


class RecentActivity(BaseModel):
    """A single event for the recent activity feed."""

    id: str
    entity_type: str  # e.g., 'Asset', 'Assignment', 'Maintenance'
    action: str       # e.g., 'Created', 'Updated', 'Completed'
    description: str
    timestamp: datetime
    user: Optional[str] = None


class AssetStatistics(BaseModel):
    """Metrics related to assets."""

    total: int
    by_status: dict[str, int]
    by_condition: dict[str, int]


class AssignmentStatistics(BaseModel):
    """Metrics related to assignments."""

    total_active: int
    total_overdue: int
    assignments_by_department: dict[str, int]


class MaintenanceStatistics(BaseModel):
    """Metrics related to maintenance tasks."""

    total_pending: int
    total_completed: int
    cost_ytd: float


class CategoryStatistics(BaseModel):
    """Metrics related to categories."""

    total: int
    asset_count_by_category: dict[str, int]


class TrendMetric(BaseModel):
    """Trend over a time period."""

    label: str
    current_value: float
    previous_value: float
    percentage_change: float


class DashboardSummary(BaseModel):
    """Aggregated summary of the dashboard."""

    metrics: SummaryMetrics
    recent_activities: List[RecentActivity]


class DashboardResponse(BaseModel):
    """Complete comprehensive dashboard snapshot."""

    summary: DashboardSummary
    assets: AssetStatistics
    assignments: AssignmentStatistics
    maintenance: MaintenanceStatistics
    categories: CategoryStatistics
    charts: List[ChartSeries]
