"""
Report & Export service.
"""

import base64
from typing import List

from loguru import logger

from app.common.exceptions import BusinessException
from app.common.service import BaseService
from app.exporters.base_exporter import BaseExporter
from app.exporters.csv_exporter import CSVExporter
from app.exporters.pdf_exporter import PDFExporter
from app.repositories.report_repository import ReportRepository
from app.schemas.report import (
    AssetReport,
    AssignmentReport,
    CategoryReport,
    ExportFormat,
    ExportRequest,
    ExportResponse,
    MaintenanceReport,
    ReportFilter,
    ReportSummary,
)


class ReportService(BaseService):
    """Business logic for querying reports and orchestrating exports."""

    def __init__(self, repository: ReportRepository) -> None:
        super().__init__(repository)
        self._repo: ReportRepository = repository

    async def get_summary(self, filters: ReportFilter) -> ReportSummary:
        """Get aggregate report summary and trends."""
        logger.debug("get_report_summary")
        stats = await self._repo.get_statistics(filters)
        trends = await self._repo.get_trends(filters)
        return ReportSummary(statistics=stats, trends=trends)

    async def get_asset_report(self, filters: ReportFilter) -> List[AssetReport]:
        """Get asset-specific report rows."""
        logger.debug("get_asset_report")
        return await self._repo.get_asset_report(filters)

    async def get_assignment_report(self, filters: ReportFilter) -> List[AssignmentReport]:
        """Get assignment-specific report rows."""
        logger.debug("get_assignment_report")
        return await self._repo.get_assignment_report(filters)

    async def get_maintenance_report(self, filters: ReportFilter) -> List[MaintenanceReport]:
        """Get maintenance-specific report rows."""
        logger.debug("get_maintenance_report")
        return await self._repo.get_maintenance_report(filters)

    async def get_category_report(self, filters: ReportFilter) -> List[CategoryReport]:
        """Get category-specific report rows."""
        logger.debug("get_category_report")
        return await self._repo.get_category_report(filters)

    async def get_statistics(self, filters: ReportFilter):
        """Get aggregate statistics without the full summary."""
        logger.debug("get_statistics")
        return await self._repo.get_statistics(filters)

    async def get_trends(self, filters: ReportFilter):
        """Get trending data without the full summary."""
        logger.debug("get_trends")
        return await self._repo.get_trends(filters)

    async def export(self, request: ExportRequest) -> ExportResponse:
        """Export a report based on the requested strategy format."""
        logger.info("export | type={} format={}", request.report_type, request.export_format)

        filters = request.filters or ReportFilter()
        raw_data = await self._repo.export_data(filters)

        exporter = self._get_exporter(request.export_format)
        
        file_name = f"{request.report_type.value}_report.{request.export_format.value}"
        
        try:
            file_bytes = exporter.export(raw_data, file_name)
            base64_data = base64.b64encode(file_bytes).decode("utf-8")
        except NotImplementedError:
            # During architecture setup, we return dummy string
            base64_data = "base64-encoded-file-placeholder"

        content_type = "text/csv" if request.export_format == ExportFormat.CSV else "application/pdf"

        return ExportResponse(
            file_name=file_name,
            file_format=request.export_format,
            content_type=content_type,
            data=base64_data,
        )

    def _get_exporter(self, format_type: ExportFormat) -> BaseExporter:
        """Factory pattern for selecting the appropriate export strategy."""
        if format_type == ExportFormat.CSV:
            return CSVExporter()
        if format_type == ExportFormat.PDF:
            return PDFExporter()
        raise BusinessException(f"Unsupported export format: {format_type}")
