"""
PDF exporter strategy.
"""

from typing import Any, List

from app.exporters.base_exporter import BaseExporter


class PDFExporter(BaseExporter):
    """Concrete strategy for exporting data as a PDF file."""

    def export(self, data: List[dict[str, Any]], filename: str) -> bytes:
        """
        Convert a list of dictionaries into PDF bytes.
        (Implementation deferred to database/infrastructure phase.)
        """
        raise NotImplementedError
