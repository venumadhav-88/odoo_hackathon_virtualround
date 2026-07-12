"""
Schemas package.

Pydantic v2 request/response models (DTOs) live here.
One sub-module per domain resource keeps them easy to locate.

Exports
-------
User-related types are re-exported here for convenient single-import access::

    from app.schemas import CurrentUser, UserResponse, UserRole
"""

from app.schemas.user import CurrentUser, TokenPayload, UserResponse, UserRole

__all__ = [
    "CurrentUser",
    "TokenPayload",
    "UserResponse",
    "UserRole",
]
