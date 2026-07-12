"""
Request / response logging middleware.

Logs each incoming request and its completed response, including the
wall-clock execution time.  Sensitive headers are redacted before
any data is written to the log.
"""

import time
from typing import Callable

from fastapi import Request, Response
from loguru import logger
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.constants import SENSITIVE_FIELDS


class RequestLoggerMiddleware(BaseHTTPMiddleware):
    """Log requests, responses, and execution duration for every call."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start = time.perf_counter()

        _log_request(request)

        response: Response = await call_next(request)

        duration_ms = (time.perf_counter() - start) * 1_000

        _log_response(request, response, duration_ms)

        return response


# ── Private helpers ───────────────────────────────────────────────────────


def _log_request(request: Request) -> None:
    """Emit a structured log line for the incoming request."""
    safe_headers = _redact_headers(dict(request.headers))
    logger.info(
        "→ {} {} | client={} | headers={}",
        request.method,
        request.url.path,
        _client_ip(request),
        safe_headers,
    )


def _log_response(request: Request, response: Response, duration_ms: float) -> None:
    """Emit a structured log line for the completed response."""
    logger.info(
        "← {} {} | status={} | duration={:.2f}ms",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )


def _redact_headers(headers: dict[str, str]) -> dict[str, str]:
    """Replace the values of sensitive headers with ``[REDACTED]``."""
    return {
        key: ("[REDACTED]" if key.lower() in SENSITIVE_FIELDS else value)
        for key, value in headers.items()
    }


def _client_ip(request: Request) -> str:
    """Extract the real client IP, honouring X-Forwarded-For when present."""
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"
