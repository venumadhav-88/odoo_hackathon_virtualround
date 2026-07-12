"""
Authentication and authorisation dependency callables.

All security-related ``Depends()`` callables live here.  Route handlers
import from this module exclusively — no authentication logic is permitted
inside routers.

Architecture note
-----------------
Each dependency is a plain async function so FastAPI can inject it via
``Depends()``.  Swapping the implementation in Phase B3 (e.g. replacing
the mock user with a real database lookup) requires changes only in this
file, not in any router.

Phase B2 note
-------------
``require_authenticated_user`` returns a **mock** ``CurrentUser`` so that
the infrastructure can be verified without a live database or real JWT
tokens.  The mock is replaced in Phase B3.
"""

from typing import Optional
from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from loguru import logger

from app.common.exceptions import AuthenticationException, AuthorizationException
from app.core.security import extract_token_from_header
from app.schemas.user import CurrentUser, UserRole

# ── Bearer token extractor (optional — allows the dependency to raise
#    a clean 401 rather than FastAPI's default 403 on missing header) ──────

_bearer_scheme = HTTPBearer(auto_error=False)


# ── Mock principal ────────────────────────────────────────────────────────
# Replaced by a real database lookup in Phase B3.

_MOCK_USER = CurrentUser(
    id=UUID("00000000-0000-0000-0000-000000000001"),
    email="admin@eam.local",
    full_name="Alex Carter",
    role=UserRole.ADMIN,
    is_active=True,
)


# ── Core authentication dependency ────────────────────────────────────────


async def require_authenticated_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer_scheme),
) -> CurrentUser:
    """Resolve the currently authenticated user from the request.

    Extracts the Bearer token from the ``Authorization`` header, decodes it,
    and returns the corresponding ``CurrentUser`` principal.

    Phase B2 behaviour
    ------------------
    Returns a mock admin user so protected routes can be tested without a
    live JWT or database.  Replace the body of this function in Phase B3.

    Args:
        credentials: The parsed Bearer token supplied by FastAPI's security
            scheme extractor.

    Returns:
        The resolved :class:`~app.schemas.user.CurrentUser` principal.

    Raises:
        :class:`~app.common.exceptions.AuthenticationException`: When no
            token is present or the token cannot be decoded.
    """
    if credentials is None:
        logger.debug("No Bearer token present — returning mock user (Phase B2).")
        # Phase B3: raise AuthenticationException() here instead of returning mock.
        return _MOCK_USER

    raw_token = extract_token_from_header(
        f"{credentials.scheme} {credentials.credentials}"
    )

    if raw_token is None:
        logger.warning("Malformed Authorization header received.")
        raise AuthenticationException("Invalid or malformed authorization header.")

    # Phase B3: decode raw_token via security.decode_access_token(),
    # look up the user in the database, and return a real CurrentUser.
    logger.debug("Token present — returning mock user (Phase B2).")
    return _MOCK_USER


# ── Role-based authorisation dependencies ────────────────────────────────


def require_roles(*allowed_roles: UserRole):
    """Return a dependency that enforces one or more allowed roles.

    Designed to be composed with ``require_authenticated_user``::

        @router.get("/admin-only")
        async def admin_endpoint(
            _: CurrentUser = Depends(require_roles(UserRole.ADMIN)),
        ):
            ...

    Args:
        *allowed_roles: One or more :class:`~app.schemas.user.UserRole`
            values the caller must possess.

    Returns:
        An async FastAPI dependency callable.

    Raises:
        :class:`~app.common.exceptions.AuthorizationException`: When the
            authenticated user does not hold any of the required roles.
    """

    async def _check_roles(
        current_user: CurrentUser = Depends(require_authenticated_user),
    ) -> CurrentUser:
        if not current_user.has_role(*allowed_roles):
            logger.warning(
                "Authorisation denied | user={} | role={} | required={}",
                current_user.email,
                current_user.role,
                [r.value for r in allowed_roles],
            )
            raise AuthorizationException(
                f"This action requires one of the following roles: "
                f"{', '.join(r.value for r in allowed_roles)}."
            )
        return current_user

    return _check_roles


# ── Convenience role shorthands ───────────────────────────────────────────


def require_admin(
    current_user: CurrentUser = Depends(require_roles(UserRole.ADMIN)),
) -> CurrentUser:
    """Dependency that restricts access to Admin users only.

    Usage::

        @router.delete("/assets/{asset_id}")
        async def delete_asset(
            _: CurrentUser = Depends(require_admin),
        ):
            ...
    """
    return current_user


def require_manager_or_above(
    current_user: CurrentUser = Depends(
        require_roles(UserRole.ADMIN, UserRole.MANAGER)
    ),
) -> CurrentUser:
    """Dependency that restricts access to Manager and Admin users.

    Usage::

        @router.post("/assets")
        async def create_asset(
            _: CurrentUser = Depends(require_manager_or_above),
        ):
            ...
    """
    return current_user


def require_any_authenticated_role(
    current_user: CurrentUser = Depends(
        require_roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE)
    ),
) -> CurrentUser:
    """Dependency that permits any authenticated user regardless of role.

    Equivalent to ``require_authenticated_user`` but also asserts that the
    user's role is a recognised application role.
    """
    return current_user
