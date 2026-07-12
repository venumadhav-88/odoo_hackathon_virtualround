"""
Base exporter strategy interface.
"""

from typing import Any, List


class BaseExporter:
    """Abstract strategy for exporting tabular data."""

    def export(self, data: List[dict[str, Any]], filename: str) -> bytes:
        """
        Export data to a specific format and return the raw bytes.
        Must be implemented by concrete strategy classes.
        """
        raise NotImplementedError
