"""
Dependencies package.

All FastAPI ``Depends()`` callables are defined here, organised by concern.

Sub-modules
-----------
- ``common`` — Generic dependencies (settings injection, etc.)
- ``auth``   — Authentication and authorisation dependencies

Exports
-------
Auth dependencies are re-exported for convenient single-import access::

    from app.dependencies import require_authenticated_user, require_admin
"""

from app.dependencies.auth import (
    require_admin,
    require_any_authenticated_role,
    require_authenticated_user,
    require_manager_or_above,
    require_roles,
)
from app.dependencies.common import settings_dependency

__all__ = [
    "require_admin",
    "require_any_authenticated_role",
    "require_authenticated_user",
    "require_manager_or_above",
    "require_roles",
    "settings_dependency",
]
