"""
Application configuration.

Reads all settings from the environment (or a .env file) using
Pydantic Settings.  A single cached `Settings` instance is exposed
via `get_settings()` so every module works with the same object.
"""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ────────────────────────────────────────────────────
    app_name: str = "Enterprise Asset Management"
    api_version: str = "1.0.0"
    debug: bool = False

    # ── Server ────────────────────────────────────────────────────────
    host: str = "0.0.0.0"
    port: int = 8000

    # ── Security ──────────────────────────────────────────────────────
    secret_key: str = "changeme"

    # ── Database (placeholder — not yet connected) ────────────────────
    database_url: str = ""
    supabase_url: str = ""
    supabase_key: str = ""

    # ── CORS ──────────────────────────────────────────────────────────
    # Stored as a raw comma-separated string so pydantic-settings never
    # attempts JSON-decoding on the env value.  Use `cors_origins` for
    # the parsed list throughout the application.
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"

    # ── Derived helpers ───────────────────────────────────────────────

    @property
    def cors_origins(self) -> List[str]:
        """Return allowed CORS origins as a parsed list."""
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def environment(self) -> str:
        """Human-readable environment label."""
        return "development" if self.debug else "production"

    @property
    def api_prefix(self) -> str:
        """Versioned URL prefix for all API routes."""
        return "/api/v1"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return the cached application settings singleton."""
    return Settings()
