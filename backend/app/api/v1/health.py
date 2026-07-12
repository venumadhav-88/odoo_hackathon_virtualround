"""
Health check endpoint.

Provides a lightweight liveness probe that returns application metadata
and server state.  No authentication required.
"""

from datetime import UTC, datetime

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.common.responses import success_response
from app.core.config import Settings, get_settings
from app.core.constants import HEALTH_TAG

router = APIRouter(tags=[HEALTH_TAG])


@router.get(
    "/health",
    summary="Application Health Check",
    description=(
        "Returns the current health status of the application, including "
        "the application name, API version, server status, UTC timestamp, "
        "and active environment."
    ),
    response_class=JSONResponse,
)
async def health_check(
    settings: Settings = Depends(get_settings),
) -> JSONResponse:
    """Return application health metadata.

    No authentication required.  Suitable for load-balancer liveness probes.
    """
    payload = {
        "app_name": settings.app_name,
        "version": settings.api_version,
        "status": "ok",
        "timestamp": datetime.now(UTC).isoformat(),
        "environment": settings.environment,
    }
    return success_response(message="Service is operational.", data=payload)
