"""
Custom application exception hierarchy.

All exceptions derive from ``AppException``, which carries:
- ``status_code``  — HTTP status to return.
- ``message``      — Client-visible description.
- ``errors``       — Optional list of granular error details.

Raise these from any layer; the global exception handler converts them
into standard ``ErrorResponse`` envelopes automatically.
"""

from typing import List, Optional

from app.common.responses import ErrorDetail


class AppException(Exception):
    """Base class for all application exceptions."""

    status_code: int = 500
    default_message: str = "An unexpected error occurred."

    def __init__(
        self,
        message: Optional[str] = None,
        errors: Optional[List[ErrorDetail]] = None,
    ) -> None:
        self.message = message or self.default_message
        self.errors: List[ErrorDetail] = errors or []
        super().__init__(self.message)


class ValidationException(AppException):
    """Raised when request data fails business-level validation."""

    status_code = 422
    default_message = "One or more fields failed validation."


class AuthenticationException(AppException):
    """Raised when identity cannot be verified."""

    status_code = 401
    default_message = "Authentication is required to access this resource."


class AuthorizationException(AppException):
    """Raised when an authenticated principal lacks the necessary permission."""

    status_code = 403
    default_message = "You do not have permission to perform this action."


class ResourceNotFoundException(AppException):
    """Raised when a requested resource does not exist."""

    status_code = 404
    default_message = "The requested resource was not found."


class BusinessException(AppException):
    """Raised when a domain/business rule is violated."""

    status_code = 409
    default_message = "The operation conflicts with a business rule."


class InternalServerException(AppException):
    """Raised for unexpected server-side failures."""

    status_code = 500
    default_message = "An unexpected error occurred. Please try again later."
