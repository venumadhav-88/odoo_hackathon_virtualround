"""
Standard API response models and builder helpers.

Every endpoint must return a response produced by one of the helpers
in this module.  Raw dictionaries must never be returned directly.

Response envelope
-----------------
Success::

    {
        "success": true,
        "message": "...",
        "data": {},
        "errors": null
    }

Failure::

    {
        "success": false,
        "message": "...",
        "data": null,
        "errors": []
    }
"""

from typing import Any, Generic, List, Optional, TypeVar

from fastapi.responses import JSONResponse
from pydantic import BaseModel

T = TypeVar("T")


# ── Envelope schemas ──────────────────────────────────────────────────────


class SuccessResponse(BaseModel, Generic[T]):
    """Schema for a successful API response."""

    success: bool = True
    message: str
    data: Optional[T] = None
    errors: None = None


class ErrorDetail(BaseModel):
    """A single validation or business error."""

    field: Optional[str] = None
    message: str


class ErrorResponse(BaseModel):
    """Schema for a failed API response."""

    success: bool = False
    message: str
    data: None = None
    errors: List[ErrorDetail] = []


# ── Builder helpers ───────────────────────────────────────────────────────


def success_response(
    message: str,
    data: Any = None,
    status_code: int = 200,
) -> JSONResponse:
    """Return a standard success envelope as a JSONResponse.

    Args:
        message: Human-readable description of the result.
        data: Payload to include.  Pass ``None`` for no-content responses.
        status_code: HTTP status code (default 200).
    """
    body = SuccessResponse(message=message, data=data)
    return JSONResponse(status_code=status_code, content=body.model_dump())


def error_response(
    message: str,
    errors: Optional[List[ErrorDetail]] = None,
    status_code: int = 400,
) -> JSONResponse:
    """Return a standard error envelope as a JSONResponse.

    Args:
        message: High-level description of the failure.
        errors: List of granular error details (field + message).
        status_code: HTTP status code (default 400).
    """
    body = ErrorResponse(message=message, errors=errors or [])
    return JSONResponse(status_code=status_code, content=body.model_dump())


def created_response(message: str, data: Any = None) -> JSONResponse:
    """Convenience wrapper for HTTP 201 Created responses."""
    return success_response(message=message, data=data, status_code=201)


def no_content_response(message: str = "Operation completed.") -> JSONResponse:
    """Convenience wrapper for HTTP 204 No Content responses."""
    return success_response(message=message, data=None, status_code=204)
