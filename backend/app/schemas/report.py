"""
Reports & Export schemas.
"""

from datetime import date
from enum import Enum
from typing import Any, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.pagination import BaseFilter, PageResponse


# ── Enums ─────────────────────────────────────────────────────────────────


class ExportFormat(str, Enum):
    """Supported export formats."""

    CSV = "csv"
    PDF = "pdf"


class ReportType(str, Enum):
    """Supported report generation domains."""

    ASSETS = "assets"
    ASSIGNMENTS = "assignments"
    MAINTENANCE = "maintenance"
    CATEGORIES = "categories"


# ── Request schemas ───────────────────────────────────────────────────────


class ReportFilter(BaseFilter):
    """Common filtering criteria for generating reports."""

    start_date: Optional[date] = None
    end_date: Optional[date] = None
    department: Optional[str] = None
    status: Optional[str] = None


class ExportRequest(BaseModel):
    """Payload to request an export file."""

    report_type: ReportType
    export_format: ExportFormat
    filters: Optional[ReportFilter] = None


# ── Response schemas ──────────────────────────────────────────────────────


class AssetReport(BaseModel):
    """Data row for an asset report."""

    asset_id: UUID
    asset_code: str
    asset_name: str
    category_name: str
    status: str
    condition: str
    purchase_cost: float


class AssignmentReport(BaseModel):
    """Data row for an assignment report."""

    assignment_id: UUID
    asset_code: str
    employee_id: UUID
    department: str
    assigned_date: date
    status: str


class MaintenanceReport(BaseModel):
    """Data row for a maintenance report."""

    maintenance_id: UUID
    asset_code: str
    technician: str
    maintenance_type: str
    actual_cost: float
    completion_date: Optional[date] = None


class CategoryReport(BaseModel):
    """Data row for a category report."""

    category_id: UUID
    category_name: str
    total_assets: int
    total_value: float


class ReportStatistics(BaseModel):
    """Summary statistics for a generated report."""

    total_records: int
    total_value: float = 0.0
    active_count: int = 0


class ReportTrend(BaseModel):
    """Trend metric within a report."""

    period: str
    value: float


class ReportSummary(BaseModel):
    """Aggregated report summary with data, statistics, and trends."""

    statistics: ReportStatistics
    trends: List[ReportTrend]


class ExportResponse(BaseModel):
    """Response containing export details or download link/bytes."""

    file_name: str
    file_format: ExportFormat
    content_type: str
    data: str  # Could be base64 string or download URL
