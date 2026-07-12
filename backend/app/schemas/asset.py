"""
Asset schemas.

Pydantic v2 DTOs for the core asset resource. These types define the
wire format for API requests and responses and are the only representation
that crosses the HTTP boundary.
"""

from datetime import date, datetime
from enum import Enum
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


# ── Enums ─────────────────────────────────────────────────────────────────


class AssetStatus(str, Enum):
    """Valid lifecycle states for an asset."""

    AVAILABLE = "available"
    ASSIGNED = "assigned"
    UNDER_MAINTENANCE = "under_maintenance"
    RETIRED = "retired"


class AssetCondition(str, Enum):
    """Physical condition of an asset."""

    NEW = "new"
    GOOD = "good"
    FAIR = "fair"
    POOR = "poor"


# ── Request schemas ───────────────────────────────────────────────────────


class AssetCreate(BaseModel):
    """Payload required to register a new asset."""

    asset_code: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Unique alphanumeric asset tracking code.",
    )
    asset_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Human-readable asset name.",
    )
    category_id: UUID = Field(
        ...,
        description="UUID of the parent category.",
    )
    manufacturer: Optional[str] = Field(None, max_length=100)
    model: Optional[str] = Field(None, max_length=100)
    serial_number: Optional[str] = Field(None, max_length=100)
    purchase_date: Optional[date] = Field(None)
    purchase_cost: Optional[float] = Field(None, ge=0.0)
    current_value: Optional[float] = Field(None, ge=0.0)
    location: Optional[str] = Field(None, max_length=200)
    warranty_expiry: Optional[date] = Field(None)
    status: AssetStatus = Field(AssetStatus.AVAILABLE)
    condition: AssetCondition = Field(AssetCondition.NEW)
    description: Optional[str] = Field(None, max_length=1000)
    assigned_to: Optional[UUID] = Field(None, description="UUID of assigned employee.")

    @field_validator("asset_code", mode="before")
    @classmethod
    def normalise_code(cls, value: str) -> str:
        """Strip whitespace and convert to uppercase."""
        return value.strip().upper()

    @field_validator(
        "asset_name", "manufacturer", "model", "serial_number",
        "location", "description", mode="before"
    )
    @classmethod
    def trim_strings(cls, value: Optional[str]) -> Optional[str]:
        """Strip leading/trailing whitespace from string fields."""
        return value.strip() if isinstance(value, str) else value


class AssetUpdate(BaseModel):
    """Payload accepted for a full asset replacement (PUT)."""

    asset_code: str = Field(..., min_length=2, max_length=50)
    asset_name: str = Field(..., min_length=2, max_length=100)
    category_id: UUID = Field(...)
    manufacturer: Optional[str] = Field(None, max_length=100)
    model: Optional[str] = Field(None, max_length=100)
    serial_number: Optional[str] = Field(None, max_length=100)
    purchase_date: Optional[date] = Field(None)
    purchase_cost: Optional[float] = Field(None, ge=0.0)
    current_value: Optional[float] = Field(None, ge=0.0)
    location: Optional[str] = Field(None, max_length=200)
    warranty_expiry: Optional[date] = Field(None)
    status: AssetStatus = Field(...)
    condition: AssetCondition = Field(...)
    description: Optional[str] = Field(None, max_length=1000)
    assigned_to: Optional[UUID] = Field(None)

    @field_validator("asset_code", mode="before")
    @classmethod
    def normalise_code(cls, value: str) -> str:
        return value.strip().upper()

    @field_validator(
        "asset_name", "manufacturer", "model", "serial_number",
        "location", "description", mode="before"
    )
    @classmethod
    def trim_strings(cls, value: Optional[str]) -> Optional[str]:
        return value.strip() if isinstance(value, str) else value


# ── Filter schema ─────────────────────────────────────────────────────────


class AssetFilter(BaseModel):
    """Filter options for the asset list/search endpoints."""

    search: Optional[str] = Field(None, max_length=100)
    category_id: Optional[UUID] = Field(None)
    status: Optional[AssetStatus] = Field(None)
    condition: Optional[AssetCondition] = Field(None)
    assigned_to: Optional[UUID] = Field(None)

    @field_validator("search", mode="before")
    @classmethod
    def trim_search(cls, value: Optional[str]) -> Optional[str]:
        return value.strip() if isinstance(value, str) else value


# ── Response schemas ──────────────────────────────────────────────────────


class AssetResponse(BaseModel):
    """Single asset representation returned by the API."""

    id: UUID
    asset_code: str
    asset_name: str
    category_id: UUID
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    purchase_date: Optional[date] = None
    purchase_cost: Optional[float] = None
    current_value: Optional[float] = None
    location: Optional[str] = None
    warranty_expiry: Optional[date] = None
    status: AssetStatus
    condition: AssetCondition
    description: Optional[str] = None
    assigned_to: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AssetListResponse(BaseModel):
    """Paginated list of assets returned by collection endpoints."""

    items: List[AssetResponse]
    total: int
    page: int
    page_size: int
