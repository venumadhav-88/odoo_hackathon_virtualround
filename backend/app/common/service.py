"""
Shared service abstractions.
"""

from typing import TypeVar

from app.common.exceptions import ValidationException

TRepo = TypeVar("TRepo")


class BaseService:
    """Abstract base service."""

    def __init__(self, repository: TRepo) -> None:
        self._repo = repository

    def _validate_pagination(
        self,
        page: int,
        page_size: int,
        max_page_size: int = 100,
    ) -> tuple[int, int]:
        """Clamp pagination parameters to safe bounds."""
        if page < 1:
            raise ValidationException("Page number must be greater than or equal to 1.")
        if page_size < 1:
            raise ValidationException("Page size must be greater than or equal to 1.")

        page_size = min(page_size, max_page_size)
        return page, page_size
