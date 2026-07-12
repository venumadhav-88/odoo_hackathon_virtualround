"""
Category repository interface.

Defines the contract that any concrete data-access implementation must
satisfy.  The service layer depends only on this interface, never on a
specific database driver, ORM, or client library.

Phase B3 note
-------------
All methods raise ``NotImplementedError``.  A concrete implementation will
be provided by the database team in a later phase and injected via
dependency injection without requiring changes to the service or router.
"""

from typing import List, Optional
from uuid import UUID

from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate


class CategoryRepository:
    """Abstract repository defining data-access operations for categories.

    Concrete subclasses will replace each ``NotImplementedError`` body with
    the appropriate database query (Supabase, SQLAlchemy, etc.).
    """

    async def get_all(
        self,
        search: Optional[str] = None,
        status: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[List[CategoryResponse], int]:
        """Return a filtered, paginated list of categories and the total count.

        Args:
            search: Optional free-text filter applied to name and code.
            status: Optional status filter ("active" | "inactive").
            page: 1-based page number.
            page_size: Maximum records per page.

        Returns:
            A tuple of ``(items, total)`` where *items* is the current page
            and *total* is the count of all matching records.

        Raises:
            NotImplementedError: Until a concrete implementation is provided.
        """
        raise NotImplementedError

    async def get_by_id(self, category_id: UUID) -> Optional[CategoryResponse]:
        """Return a single category by its primary key, or ``None``.

        Args:
            category_id: The UUID of the category to retrieve.

        Returns:
            The matching :class:`~app.schemas.category.CategoryResponse`,
            or ``None`` when no record is found.

        Raises:
            NotImplementedError: Until a concrete implementation is provided.
        """
        raise NotImplementedError

    async def create(self, payload: CategoryCreate) -> CategoryResponse:
        """Persist a new category and return the created record.

        Args:
            payload: Validated creation data.

        Returns:
            The newly created :class:`~app.schemas.category.CategoryResponse`.

        Raises:
            NotImplementedError: Until a concrete implementation is provided.
        """
        raise NotImplementedError

    async def update(
        self,
        category_id: UUID,
        payload: CategoryUpdate,
    ) -> CategoryResponse:
        """Replace an existing category's fields and return the updated record.

        Args:
            category_id: The UUID of the category to update.
            payload: Validated replacement data.

        Returns:
            The updated :class:`~app.schemas.category.CategoryResponse`.

        Raises:
            NotImplementedError: Until a concrete implementation is provided.
        """
        raise NotImplementedError

    async def delete(self, category_id: UUID) -> None:
        """Permanently remove a category record.

        Args:
            category_id: The UUID of the category to delete.

        Raises:
            NotImplementedError: Until a concrete implementation is provided.
        """
        raise NotImplementedError

    async def exists(self, category_id: UUID) -> bool:
        """Return True when a category with the given ID exists.

        Args:
            category_id: The UUID to check.

        Raises:
            NotImplementedError: Until a concrete implementation is provided.
        """
        raise NotImplementedError

    async def search(
        self,
        query: str,
        limit: int = 10,
    ) -> List[CategoryResponse]:
        """Return categories whose name or code contains *query*.

        Args:
            query: The search term.
            limit: Maximum number of results to return.

        Returns:
            A list of matching :class:`~app.schemas.category.CategoryResponse`
            objects, capped at *limit*.

        Raises:
            NotImplementedError: Until a concrete implementation is provided.
        """
        raise NotImplementedError
