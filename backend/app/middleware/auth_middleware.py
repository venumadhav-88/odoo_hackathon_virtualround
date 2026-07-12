"""
Authentication middleware.

Provides a Starlette middleware layer for request-level authentication
concerns that must be applied before route handlers are reached — such as
attaching a request-scoped identity context or enforcing token presence on
a path prefix.

Phase B2 note
-------------
The middleware currently logs token presence for observability but does NOT
enforce authentication.  Actual enforcement is handled by individual route
dependencies (``require_authenticated_user``, ``require_admin``, etc.) so
that public endpoints (e.g. ``/api/v1/health``) remain unaffected.

Authentication enforcement via middleware (rather than per-route
dependencies) may be adopted in a later phase if a blanket policy is
required.  The structure is prepared for that without pre-implementing it.
"""

from typing import Callable

from fastapi import Request, Response
from loguru import logger
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.constants import SENSITIVE_FIELDS
from app.core.security import extract_token_from_header

# Paths that are always accessible without a token.
_PUBLIC_PATHS: frozenset[str] = frozenset(
    {
        "/api/v1/health",
        "/docs",
        "/redoc",
        "/openapi.json",
    }
)


class AuthMiddleware(BaseHTTPMiddleware):
    """Request-level middleware for authentication observability.

    Inspects each incoming request for a Bearer token and attaches a
    lightweight token-presence indicator to the request state.  This
    allows downstream components (e.g. loggers, audit services) to know
    whether a request arrived authenticated without performing a full
    database-backed validation here.

    Actual identity resolution and access control remain the responsibility
    of per-route ``Depends()`` callables in ``app/dependencies/auth.py``.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Inspect the request, annotate state, and pass through."""
        is_public = request.url.path in _PUBLIC_PATHS
        token = extract_token_from_header(request.headers.get("authorization"))

        # Attach token-presence flag to request state for downstream access.
        request.state.has_token = token is not None
        request.state.is_public_path = is_public

        _log_auth_context(request, is_public, has_token=token is not None)

        response: Response = await call_next(request)
        return response


# ── Private helpers ───────────────────────────────────────────────────────


def _log_auth_context(
    request: Request,
    is_public: bool,
    has_token: bool,
) -> None:
    """Emit a debug-level log describing the auth context of the request."""
    path = request.url.path
    method = request.method

    if is_public:
        logger.debug("{} {} — public path, auth not required.", method, path)
    elif has_token:
        logger.debug("{} {} — Bearer token present.", method, path)
    else:
        logger.debug(
            "{} {} — no Bearer token; route dependency will enforce access control.",
            method,
            path,
        )
