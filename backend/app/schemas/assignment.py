"""
Asset Assignment schemas.

Pydantic v2 DTOs for the asset assignment module.
"""

from datetime import date, datetime
from enum import Enum
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

from app.schemas.pagination import BaseFilter, PageResponse


# ── Enums ─────────────────────────────────────────────────────────────────


class AssignmentStatus(str, Enum):
    """Lifecycle states of an assignment workflow."""

    ACTIVE = "active"
    RETURNED = "returned"
    CANCELLED = "cancelled"


class ReturnCondition(str, Enum):
    """Condition of an asset upon return."""

    NEW = "new"
    GOOD = "good"
    FAIR = "fair"
    POOR = "poor"
    DAMAGED = "damaged"


# ── Request schemas ───────────────────────────────────────────────────────


class AssignmentCreate(BaseModel):
    """Payload to assign an asset to an employee."""

    asset_id: UUID
    employee_id: UUID
    expected_return_date: Optional[date] = None
    department: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = Field(None, max_length=1000)

    @field_validator("department", "notes", mode="before")
    @classmethod
    def trim_strings(cls, value: Optional[str]) -> Optional[str]:
        return value.strip() if isinstance(value, str) else value


class AssignmentUpdate(BaseModel):
    """Payload to update an assignment."""

    expected_return_date: Optional[date] = None
    department: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = Field(None, max_length=1000)

    @field_validator("department", "notes", mode="before")
    @classmethod
    def trim_strings(cls, value: Optional[str]) -> Optional[str]:
        return value.strip() if isinstance(value, str) else value


class AssignmentReturn(BaseModel):
    """Payload when an asset is returned."""

    return_condition: ReturnCondition
    notes: Optional[str] = Field(None, max_length=1000)

    @field_validator("notes", mode="before")
    @classmethod
    def trim_strings(cls, value: Optional[str]) -> Optional[str]:
        return value.strip() if isinstance(value, str) else value


# ── Filter schema ─────────────────────────────────────────────────────────


class AssignmentFilter(BaseFilter):
    """Filter criteria for assignments."""

    asset_id: Optional[UUID] = None
    employee_id: Optional[UUID] = None
    status: Optional[AssignmentStatus] = None
    department: Optional[str] = Field(None, max_length=100)

    @field_validator("department", mode="before")
    @classmethod
    def trim_strings(cls, value: Optional[str]) -> Optional[str]:
        return value.strip() if isinstance(value, str) else value


# ── Response schemas ──────────────────────────────────────────────────────


class AssignmentResponse(BaseModel):
    """Full details of an asset assignment."""

    id: UUID
    asset_id: UUID
    employee_id: UUID
    assigned_by: UUID
    assigned_date: date
    expected_return_date: Optional[date] = None
    actual_return_date: Optional[date] = None
    status: AssignmentStatus
    return_condition: Optional[ReturnCondition] = None
    department: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AssignmentListResponse(PageResponse[AssignmentResponse]):
    """Paginated list of assignments."""
    pass


class AssignmentTimelineResponse(BaseModel):
    """History and timeline events of an assignment."""

    assignment_id: UUID
    events: List[dict] = Field(default_factory=list)
