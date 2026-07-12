"""
Application factory and entry point.

``create_app()`` builds and returns the configured ``FastAPI`` instance.
``app`` is the module-level singleton consumed by Uvicorn.

Uvicorn invocation::

    uvicorn app.main:app --reload
"""

import sys

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.api.v1.router import router as v1_router
from app.core.config import get_settings
from app.core.constants import (
    API_V1_PREFIX,
    LOG_FORMAT,
    LOG_LEVEL_DEVELOPMENT,
    LOG_LEVEL_PRODUCTION,
    LOG_RETENTION,
    LOG_ROTATION,
)
from app.middleware.exception_handler import (
    ExceptionHandlerMiddleware,
    validation_exception_handler,
)
from app.middleware.auth_middleware import AuthMiddleware
from app.middleware.request_logger import RequestLoggerMiddleware


# ── Logging setup ─────────────────────────────────────────────────────────


def _configure_logging(debug: bool) -> None:
    """Initialise Loguru with environment-appropriate settings."""
    logger.remove()

    level = LOG_LEVEL_DEVELOPMENT if debug else LOG_LEVEL_PRODUCTION

    # Console sink — always active
    logger.add(
        sys.stderr,
        format=LOG_FORMAT,
        level=level,
        colorize=True,
        backtrace=debug,
        diagnose=debug,
    )

    # Rotating file sink — production behaviour
    if not debug:
        logger.add(
            "logs/app.log",
            format=LOG_FORMAT,
            level=level,
            rotation=LOG_ROTATION,
            retention=LOG_RETENTION,
            compression="zip",
            backtrace=False,
            diagnose=False,
        )


# ── Lifespan events ───────────────────────────────────────────────────────


async def _on_startup() -> None:
    """Emit a startup log and perform lightweight readiness checks."""
    settings = get_settings()
    logger.info(
        "✓ {} v{} starting in {} mode on {}:{}",
        settings.app_name,
        settings.api_version,
        settings.environment,
        settings.host,
        settings.port,
    )
    logger.info("✓ CORS allowed origins: {}", settings.cors_origins)
    logger.info("✓ API prefix: {}", API_V1_PREFIX)
    logger.info("Application startup complete.")


async def _on_shutdown() -> None:
    """Release resources and log graceful shutdown."""
    logger.info("Application shutting down — releasing resources.")


# ── Application factory ───────────────────────────────────────────────────


def create_app() -> FastAPI:
    """Build and return the configured FastAPI application.

    All middleware, exception handlers, routes, and startup/shutdown
    hooks are wired here so that the module-level ``app`` object is a
    fully-formed instance ready for Uvicorn.
    """
    settings = get_settings()

    _configure_logging(settings.debug)

    application = FastAPI(
        title=settings.app_name,
        version=settings.api_version,
        description=(
            "Enterprise Asset Management System — REST API.\n\n"
            "Provides structured endpoints for managing physical assets, "
            "assignments, maintenance records, categories, employees, "
            "and system configuration."
        ),
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        contact={
            "name": "EAM Engineering Team",
        },
        license_info={
            "name": "Proprietary",
        },
        on_startup=[_on_startup],
        on_shutdown=[_on_shutdown],
    )

    # ── Middleware (outermost registered = innermost executed) ─────────
    application.add_middleware(ExceptionHandlerMiddleware)
    application.add_middleware(RequestLoggerMiddleware)
    application.add_middleware(AuthMiddleware)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Exception handlers ─────────────────────────────────────────────
    application.add_exception_handler(
        RequestValidationError,
        validation_exception_handler,  # type: ignore[arg-type]
    )

    # ── Routes ────────────────────────────────────────────────────────
    application.include_router(v1_router, prefix=API_V1_PREFIX)

    return application


# ── Module-level singleton ─────────────────────────────────────────────────

app: FastAPI = create_app()
