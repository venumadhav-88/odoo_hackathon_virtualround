"""
Shared repository abstractions.
"""

from typing import Generic, List, Optional, TypeVar

T = TypeVar("T")
CreateT = TypeVar("CreateT")
UpdateT = TypeVar("UpdateT")
ID_T = TypeVar("ID_T")


class BaseRepository(Generic[T, CreateT, UpdateT, ID_T]):
    """Abstract base repository defining standard CRUD data-access operations."""

    async def get_all(
        self,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[List[T], int]:
        raise NotImplementedError

    async def get_by_id(self, entity_id: ID_T) -> Optional[T]:
        raise NotImplementedError

    async def create(self, payload: CreateT) -> T:
        raise NotImplementedError

    async def update(self, entity_id: ID_T, payload: UpdateT) -> T:
        raise NotImplementedError

    async def delete(self, entity_id: ID_T) -> None:
        raise NotImplementedError

    async def exists(self, entity_id: ID_T) -> bool:
        raise NotImplementedError
