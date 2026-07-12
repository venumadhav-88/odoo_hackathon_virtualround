"""
Category schemas.

Pydantic v2 DTOs for the category resource.  These types define the
wire format for API requests and responses and are the only representation
that crosses the HTTP boundary.

Domain fields mirror the frontend model::

    id          – UUID primary key
    code        – Short uppercase identifier (e.g. "IT", "FUR")
    name        – Display name
    description – Optional free-text description
    asset_count – Denormalised count of assets in this category
    status      – "active" | "inactive"
    created_at  – ISO 8601 UTC creation timestamp
    updated_at  – ISO 8601 UTC last-modified timestamp
"""

from datetime import datetime
from enum import Enum
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


# ── Enum ──────────────────────────────────────────────────────────────────


class CategoryStatus(str, Enum):
    """Valid lifecycle states for a category."""

    ACTIVE = "active"
    INACTIVE = "inactive"


# ── Request schemas ───────────────────────────────────────────────────────


class CategoryCreate(BaseModel):
    """Payload required to create a new category."""

    code: str = Field(
        ...,
        min_length=1,
        max_length=10,
        description="Short uppercase category code (e.g. 'IT', 'FUR').",
    )
    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Human-readable category name.",
    )
    description: Optional[str] = Field(
        None,
        max_length=500,
        description="Optional free-text description of the category.",
    )
    status: CategoryStatus = Field(
        CategoryStatus.ACTIVE,
        description="Initial lifecycle status.",
    )

    @field_validator("code", mode="before")
    @classmethod
    def normalise_code(cls, value: str) -> str:
        """Strip whitespace and convert code to uppercase."""
        return value.strip().upper()

    @field_validator("name", "description", mode="before")
    @classmethod
    def trim_strings(cls, value: Optional[str]) -> Optional[str]:
        """Strip leading/trailing whitespace from string fields."""
        return value.strip() if isinstance(value, str) else value


class CategoryUpdate(BaseModel):
    """Payload accepted for a full category replacement (PUT).

    All fields are required; partial updates are not supported at this
    endpoint to keep the contract explicit.
    """

    code: str = Field(
        ...,
        min_length=1,
        max_length=10,
        description="Short uppercase category code.",
    )
    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Human-readable category name.",
    )
    description: Optional[str] = Field(
        None,
        max_length=500,
        description="Optional free-text description.",
    )
    status: CategoryStatus = Field(
        ...,
        description="Lifecycle status.",
    )

    @field_validator("code", mode="before")
    @classmethod
    def normalise_code(cls, value: str) -> str:
        """Strip whitespace and convert code to uppercase."""
        return value.strip().upper()

    @field_validator("name", "description", mode="before")
    @classmethod
    def trim_strings(cls, value: Optional[str]) -> Optional[str]:
        """Strip leading/trailing whitespace from string fields."""
        return value.strip() if isinstance(value, str) else value


# ── Filter schema ─────────────────────────────────────────────────────────


class CategoryFilter(BaseModel):
    """Query-parameter filter options for the category list endpoint."""

    search: Optional[str] = Field(
        None,
        max_length=100,
        description="Free-text search matched against name and code.",
    )
    status: Optional[CategoryStatus] = Field(
        None,
        description="Filter by lifecycle status.",
    )

    @field_validator("search", mode="before")
    @classmethod
    def trim_search(cls, value: Optional[str]) -> Optional[str]:
        """Strip whitespace from search terms."""
        return value.strip() if isinstance(value, str) else value


# ── Response schemas ──────────────────────────────────────────────────────


class CategoryResponse(BaseModel):
    """Single category representation returned by the API."""

    id: UUID = Field(..., description="Unique category identifier.")
    code: str = Field(..., description="Short uppercase category code.")
    name: str = Field(..., description="Human-readable category name.")
    description: Optional[str] = Field(None, description="Free-text description.")
    asset_count: int = Field(0, description="Number of assets in this category.")
    status: CategoryStatus = Field(..., description="Lifecycle status.")
    created_at: datetime = Field(..., description="UTC creation timestamp.")
    updated_at: datetime = Field(..., description="UTC last-modified timestamp.")

    model_config = {"from_attributes": True}


class CategoryListResponse(BaseModel):
    """Paginated list of categories returned by the collection endpoint."""

    items: List[CategoryResponse] = Field(..., description="Page of category records.")
    total: int = Field(..., description="Total matching records across all pages.")
    page: int = Field(..., description="Current 1-based page number.")
    page_size: int = Field(..., description="Maximum records per page.")
