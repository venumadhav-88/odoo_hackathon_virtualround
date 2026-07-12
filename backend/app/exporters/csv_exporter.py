"""
CSV exporter strategy.
"""

from typing import Any, List

from app.exporters.base_exporter import BaseExporter


class CSVExporter(BaseExporter):
    """Concrete strategy for exporting data as a CSV file."""

    def export(self, data: List[dict[str, Any]], filename: str) -> bytes:
        """
        Convert a list of dictionaries into CSV bytes.
        (Implementation deferred to database/infrastructure phase.)
        """
        raise NotImplementedError
