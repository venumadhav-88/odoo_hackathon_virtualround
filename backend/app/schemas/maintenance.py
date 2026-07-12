"""
Maintenance schemas.
"""

from datetime import date, datetime
from enum import Enum
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

from app.schemas.pagination import BaseFilter, PageResponse


# ── Enums ─────────────────────────────────────────────────────────────────


class MaintenanceStatus(str, Enum):
    """Lifecycle states of a maintenance record."""

    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class MaintenancePriority(str, Enum):
    """Priority levels."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class MaintenanceType(str, Enum):
    """Categories of maintenance."""

    PREVENTIVE = "preventive"
    CORRECTIVE = "corrective"
    INSPECTION = "inspection"
    CALIBRATION = "calibration"
    EMERGENCY = "emergency"


# ── Request schemas ───────────────────────────────────────────────────────


class MaintenanceCreate(BaseModel):
    """Payload to schedule a new maintenance task."""

    asset_id: UUID
    technician: Optional[str] = Field(None, max_length=100)
    scheduled_date: date
    estimated_cost: Optional[float] = Field(None, ge=0.0)
    priority: MaintenancePriority = Field(MaintenancePriority.MEDIUM)
    maintenance_type: MaintenanceType = Field(MaintenanceType.PREVENTIVE)
    description: Optional[str] = Field(None, max_length=1000)
    remarks: Optional[str] = Field(None, max_length=1000)

    @field_validator("technician", "description", "remarks", mode="before")
    @classmethod
    def trim_strings(cls, value: Optional[str]) -> Optional[str]:
        return value.strip() if isinstance(value, str) else value


class MaintenanceUpdate(BaseModel):
    """Payload to update scheduled maintenance."""

    technician: Optional[str] = Field(None, max_length=100)
    scheduled_date: date
    estimated_cost: Optional[float] = Field(None, ge=0.0)
    priority: MaintenancePriority
    maintenance_type: MaintenanceType
    description: Optional[str] = Field(None, max_length=1000)
    remarks: Optional[str] = Field(None, max_length=1000)

    @field_validator("technician", "description", "remarks", mode="before")
    @classmethod
    def trim_strings(cls, value: Optional[str]) -> Optional[str]:
        return value.strip() if isinstance(value, str) else value


class MaintenanceComplete(BaseModel):
    """Payload when completing a maintenance task."""

    completion_date: date
    actual_cost: Optional[float] = Field(None, ge=0.0)
    remarks: Optional[str] = Field(None, max_length=1000)

    @field_validator("remarks", mode="before")
    @classmethod
    def trim_strings(cls, value: Optional[str]) -> Optional[str]:
        return value.strip() if isinstance(value, str) else value


# ── Filter schema ─────────────────────────────────────────────────────────


class MaintenanceFilter(BaseFilter):
    """Filter criteria for maintenance tasks."""

    asset_id: Optional[UUID] = None
    status: Optional[MaintenanceStatus] = None
    priority: Optional[MaintenancePriority] = None
    maintenance_type: Optional[MaintenanceType] = None
    technician: Optional[str] = Field(None, max_length=100)

    @field_validator("technician", mode="before")
    @classmethod
    def trim_strings(cls, value: Optional[str]) -> Optional[str]:
        return value.strip() if isinstance(value, str) else value


# ── Response schemas ──────────────────────────────────────────────────────


class MaintenanceResponse(BaseModel):
    """Full details of a maintenance record."""

    id: UUID
    asset_id: UUID
    technician: Optional[str] = None
    scheduled_date: date
    start_date: Optional[date] = None
    completion_date: Optional[date] = None
    estimated_cost: Optional[float] = None
    actual_cost: Optional[float] = None
    priority: MaintenancePriority
    status: MaintenanceStatus
    maintenance_type: MaintenanceType
    description: Optional[str] = None
    remarks: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class MaintenanceListResponse(PageResponse[MaintenanceResponse]):
    """Paginated list of maintenance tasks."""
    pass
