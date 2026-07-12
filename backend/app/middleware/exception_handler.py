"""
Global exception handler middleware.

Catches every unhandled exception that escapes the route handlers and
converts it into a consistent ``ErrorResponse`` envelope.  Python
tracebacks are never forwarded to clients.
"""

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from loguru import logger
from starlette.middleware.base import BaseHTTPMiddleware

from app.common.exceptions import AppException
from app.common.responses import ErrorDetail, ErrorResponse
from app.core.constants import MSG_INTERNAL_ERROR, MSG_VALIDATION_ERROR


class ExceptionHandlerMiddleware(BaseHTTPMiddleware):
    """Convert all unhandled exceptions into standard error envelopes."""

    async def dispatch(self, request: Request, call_next):  # type: ignore[override]
        try:
            return await call_next(request)
        except AppException as exc:
            logger.warning(
                "Application exception | status={} | message={}",
                exc.status_code,
                exc.message,
            )
            return _build_error_response(exc.message, exc.errors, exc.status_code)
        except Exception as exc:  # noqa: BLE001
            logger.exception("Unhandled exception during request processing: {}", exc)
            return _build_error_response(MSG_INTERNAL_ERROR, [], 500)


# ── FastAPI validation error handler (registered on the app, not middleware) ──


async def validation_exception_handler(
    _request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    """Convert Pydantic / FastAPI validation errors into the error envelope."""
    errors = [
        ErrorDetail(
            field=_format_field(error.get("loc", ())),
            message=error.get("msg", "Invalid value."),
        )
        for error in exc.errors()
    ]
    logger.debug("Request validation failed | errors={}", errors)
    return _build_error_response(MSG_VALIDATION_ERROR, errors, 422)


# ── Helpers ───────────────────────────────────────────────────────────────


def _format_field(loc: tuple) -> str:
    """Flatten a Pydantic location tuple into a dot-separated field path."""
    return ".".join(str(part) for part in loc if part != "body")


def _build_error_response(
    message: str,
    errors: list[ErrorDetail],
    status_code: int,
) -> JSONResponse:
    body = ErrorResponse(message=message, errors=errors)
    return JSONResponse(status_code=status_code, content=body.model_dump())
