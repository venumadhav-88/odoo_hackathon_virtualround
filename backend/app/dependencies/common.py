"""
Shared FastAPI dependency callables.

Inject these via ``Depends()`` in route signatures.  Each function is
intentionally small and focused — no business logic lives here.
"""

from fastapi import Depends

from app.core.config import Settings, get_settings


def settings_dependency(
    settings: Settings = Depends(get_settings),
) -> Settings:
    """Inject the application settings into a route handler."""
    return settings
