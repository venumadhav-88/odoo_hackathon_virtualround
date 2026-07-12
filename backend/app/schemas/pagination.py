"""
Shared pagination models.
"""

from typing import Generic, List, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class PageRequest(BaseModel):
    """Pagination query parameters."""

    page: int = Field(1, ge=1, description="1-based page number.")
    page_size: int = Field(20, ge=1, le=100, description="Records per page.")


class PageResponse(BaseModel, Generic[T]):
    """Paginated list response."""

    items: List[T]
    total: int
    page: int
    page_size: int


class BaseFilter(BaseModel):
    """Base model for filter classes."""
    pass
