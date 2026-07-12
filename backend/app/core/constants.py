"""
Application-wide constants.

All values are immutable literals — no configuration reads happen here.
If a constant depends on configuration, derive it inside the consumer
module after loading settings.
"""

# ── API ────────────────────────────────────────────────────────────────────
API_V1_PREFIX: str = "/api/v1"
HEALTH_TAG: str = "Health"

# ── HTTP Status Text ───────────────────────────────────────────────────────
STATUS_OK: str = "ok"
STATUS_ERROR: str = "error"

# ── Generic Message Strings ────────────────────────────────────────────────
MSG_INTERNAL_ERROR: str = "An unexpected error occurred. Please try again later."
MSG_NOT_FOUND: str = "The requested resource was not found."
MSG_VALIDATION_ERROR: str = "One or more fields failed validation."
MSG_UNAUTHORIZED: str = "Authentication is required to access this resource."
MSG_FORBIDDEN: str = "You do not have permission to perform this action."

# ── Logging ───────────────────────────────────────────────────────────────
LOG_FORMAT: str = (
    "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
    "<level>{level: <8}</level> | "
    "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
    "<level>{message}</level>"
)
LOG_ROTATION: str = "10 MB"
LOG_RETENTION: str = "7 days"
LOG_LEVEL_PRODUCTION: str = "INFO"
LOG_LEVEL_DEVELOPMENT: str = "DEBUG"

# ── Sensitive Field Names (never logged) ──────────────────────────────────
SENSITIVE_FIELDS: frozenset[str] = frozenset(
    {
        "password",
        "token",
        "secret",
        "authorization",
        "x-api-key",
        "cookie",
        "set-cookie",
        "supabase_key",
        "database_url",
    }
)
