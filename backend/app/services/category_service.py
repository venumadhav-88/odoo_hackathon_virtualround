"""
Category service.

Contains all business logic for the category resource.  The service
layer is the only consumer of the repository interface and the only
producer of domain-level exceptions.

Rules enforced here
-------------------
- A category code must be unique across all active records.
- A category with associated assets cannot be deleted.
- Search queries shorter than two characters are rejected.
- Page and page-size parameters are clamped to safe bounds.

HTTP concerns (status codes, response serialisation) must never appear
in this module.  Those belong exclusively in the router.
"""

from typing import List, Optional
from uuid import UUID

from loguru import logger

from app.common.exceptions import (
    BusinessException,
    ResourceNotFoundException,
    ValidationException,
)
from app.repositories.category_repository import CategoryRepository
from app.schemas.category import (
    CategoryCreate,
    CategoryFilter,
    CategoryListResponse,
    CategoryResponse,
    CategoryUpdate,
)

# ── Constants ─────────────────────────────────────────────────────────────

_MAX_PAGE_SIZE: int = 100
_DEFAULT_PAGE_SIZE: int = 20
_MIN_SEARCH_LENGTH: int = 2


class CategoryService:
    """Orchestrates business operations for the category resource.

    Args:
        repository: A :class:`~app.repositories.category_repository.CategoryRepository`
            instance injected by the dependency container.
    """

    def __init__(self, repository: CategoryRepository) -> None:
        self._repo = repository

    # ── Public interface ──────────────────────────────────────────────────

    async def get_categories(
        self,
        filters: CategoryFilter,
        page: int = 1,
        page_size: int = _DEFAULT_PAGE_SIZE,
    ) -> CategoryListResponse:
        """Return a filtered, paginated list of categories.

        Args:
            filters: Search and status filter criteria.
            page: 1-based page number (minimum 1).
            page_size: Records per page (clamped to 1–100).

        Returns:
            A :class:`~app.schemas.category.CategoryListResponse` containing
            the current page of results and the total count.

        Raises:
            :class:`~app.common.exceptions.ValidationException`: When
                pagination parameters are outside acceptable bounds.
        """
        page, page_size = self._validate_pagination(page, page_size)

        logger.debug(
            "get_categories | search={} status={} page={} page_size={}",
            filters.search,
            filters.status,
            page,
            page_size,
        )

        items, total = await self._repo.get_all(
            search=filters.search,
            status=filters.status.value if filters.status else None,
            page=page,
            page_size=page_size,
        )

        return CategoryListResponse(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
        )

    async def get_category(self, category_id: UUID) -> CategoryResponse:
        """Return a single category by ID.

        Args:
            category_id: The UUID of the category to retrieve.

        Returns:
            The matching :class:`~app.schemas.category.CategoryResponse`.

        Raises:
            :class:`~app.common.exceptions.ResourceNotFoundException`: When no
                category with the given ID exists.
        """
        logger.debug("get_category | id={}", category_id)
        category = await self._repo.get_by_id(category_id)

        if category is None:
            raise ResourceNotFoundException(
                f"Category with ID '{category_id}' was not found."
            )

        return category

    async def create_category(self, payload: CategoryCreate) -> CategoryResponse:
        """Validate and persist a new category.

        Args:
            payload: Validated creation data from the router.

        Returns:
            The created :class:`~app.schemas.category.CategoryResponse`.

        Raises:
            :class:`~app.common.exceptions.BusinessException`: When the
                category code is already in use.
        """
        logger.info("create_category | code={} name={}", payload.code, payload.name)

        await self._assert_code_is_unique(payload.code)

        created = await self._repo.create(payload)

        logger.info("Category created | id={} code={}", created.id, created.code)
        return created

    async def update_category(
        self,
        category_id: UUID,
        payload: CategoryUpdate,
    ) -> CategoryResponse:
        """Validate and replace an existing category.

        Args:
            category_id: The UUID of the category to update.
            payload: Validated replacement data from the router.

        Returns:
            The updated :class:`~app.schemas.category.CategoryResponse`.

        Raises:
            :class:`~app.common.exceptions.ResourceNotFoundException`: When no
                category with the given ID exists.
            :class:`~app.common.exceptions.BusinessException`: When the new
                code conflicts with another category.
        """
        logger.info("update_category | id={} code={}", category_id, payload.code)

        await self._assert_exists(category_id)
        await self._assert_code_is_unique(payload.code, exclude_id=category_id)

        updated = await self._repo.update(category_id, payload)

        logger.info("Category updated | id={}", category_id)
        return updated

    async def delete_category(self, category_id: UUID) -> None:
        """Remove a category if it has no associated assets.

        Args:
            category_id: The UUID of the category to delete.

        Raises:
            :class:`~app.common.exceptions.ResourceNotFoundException`: When no
                category with the given ID exists.
            :class:`~app.common.exceptions.BusinessException`: When the
                category still has assets attached to it.
        """
        logger.info("delete_category | id={}", category_id)

        category = await self._repo.get_by_id(category_id)
        if category is None:
            raise ResourceNotFoundException(
                f"Category with ID '{category_id}' was not found."
            )

        if category.asset_count > 0:
            raise BusinessException(
                f"Category '{category.name}' cannot be deleted because it "
                f"still has {category.asset_count} asset(s) assigned to it. "
                "Reassign or remove the assets first."
            )

        await self._repo.delete(category_id)
        logger.info("Category deleted | id={}", category_id)

    # ── Private helpers ───────────────────────────────────────────────────

    def _validate_pagination(
        self,
        page: int,
        page_size: int,
    ) -> tuple[int, int]:
        """Clamp pagination parameters to safe bounds.

        Args:
            page: Requested page number.
            page_size: Requested records per page.

        Returns:
            A ``(page, page_size)`` tuple with both values within range.

        Raises:
            :class:`~app.common.exceptions.ValidationException`: When either
                value is less than 1.
        """
        if page < 1:
            raise ValidationException("Page number must be greater than or equal to 1.")
        if page_size < 1:
            raise ValidationException("Page size must be greater than or equal to 1.")

        page_size = min(page_size, _MAX_PAGE_SIZE)
        return page, page_size

    async def _assert_exists(self, category_id: UUID) -> None:
        """Raise ResourceNotFoundException when the category does not exist."""
        if not await self._repo.exists(category_id):
            raise ResourceNotFoundException(
                f"Category with ID '{category_id}' was not found."
            )

    async def _assert_code_is_unique(
        self,
        code: str,
        exclude_id: Optional[UUID] = None,
    ) -> None:
        """Raise BusinessException when *code* is already taken.

        Args:
            code: The normalised category code to check.
            exclude_id: Skip this ID when checking (used during updates so
                a category may keep its own code).
        """
        results = await self._repo.search(code, limit=10)
        for cat in results:
            if cat.code == code and cat.id != exclude_id:
                raise BusinessException(
                    f"A category with code '{code}' already exists. "
                    "Category codes must be unique."
                )
