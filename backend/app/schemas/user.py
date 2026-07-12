"""
User schemas.

Defines the Pydantic v2 data transfer objects and enumerations for user
identity throughout the application.  These types are shared across the
authentication infrastructure, dependency injection layer, and any future
user-related endpoints.

No database models or ORM mappings live here — only wire-format contracts.
"""

from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class UserRole(str, Enum):
    """Enumeration of all supported application roles.

    Values are lowercase strings so they can be stored and transported
    as plain text without a separate mapping step.
    """

    ADMIN = "admin"
    MANAGER = "manager"
    EMPLOYEE = "employee"


class UserResponse(BaseModel):
    """Public-facing representation of a user record.

    Returned by endpoints that expose user information.  Never includes
    credentials or internal fields.
    """

    id: UUID = Field(..., description="Unique user identifier.")
    email: str = Field(..., description="User email address.")
    full_name: str = Field(..., description="Display name of the user.")
    role: UserRole = Field(..., description="Assigned application role.")
    is_active: bool = Field(True, description="Whether the account is active.")
    created_at: datetime = Field(..., description="UTC timestamp of account creation.")

    model_config = {"from_attributes": True}


class CurrentUser(BaseModel):
    """Lightweight principal object carried by authenticated requests.

    Populated by the authentication dependency and injected into route
    handlers that require a known identity.  Intentionally minimal — only
    the fields needed for authorisation decisions and audit logging.
    """

    id: UUID = Field(..., description="Unique user identifier.")
    email: str = Field(..., description="User email address.")
    full_name: str = Field(..., description="Display name of the user.")
    role: UserRole = Field(..., description="Assigned application role.")
    is_active: bool = Field(True, description="Whether the account is currently active.")

    # ── Convenience helpers ───────────────────────────────────────────

    def is_admin(self) -> bool:
        """Return True when the user holds the Admin role."""
        return self.role == UserRole.ADMIN

    def is_manager(self) -> bool:
        """Return True when the user holds the Manager role."""
        return self.role == UserRole.MANAGER

    def has_role(self, *roles: UserRole) -> bool:
        """Return True when the user holds any of the supplied roles."""
        return self.role in roles

    model_config = {"from_attributes": True}


class TokenPayload(BaseModel):
    """Parsed contents of a decoded JWT access token.

    Populated by :func:`app.core.security.decode_access_token` and consumed
    by the authentication dependency to reconstruct a :class:`CurrentUser`.
    """

    sub: Optional[str] = Field(None, description="Subject — typically the user UUID as a string.")
    role: Optional[str] = Field(None, description="Role claim embedded at token issuance.")
    exp: Optional[int] = Field(None, description="Expiry Unix timestamp (UTC).")
