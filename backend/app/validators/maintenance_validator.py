"""
Maintenance business rules validator.
"""

from datetime import date
from typing import Optional

from app.common.exceptions import BusinessException
from app.schemas.maintenance import MaintenanceStatus


class MaintenanceValidator:
    """Contains pure validation logic for maintenance workflows."""

    @staticmethod
    def validate_start_transition(current_status: MaintenanceStatus, start_date: date, scheduled_date: date) -> None:
        """Validate if a maintenance task can be started."""
        if current_status == MaintenanceStatus.COMPLETED:
            raise BusinessException("Cannot restart an already completed maintenance task.")
        if current_status == MaintenanceStatus.CANCELLED:
            raise BusinessException("Cannot start a cancelled maintenance task.")
        if current_status == MaintenanceStatus.IN_PROGRESS:
            raise BusinessException("Maintenance is already in progress.")
        
        if start_date < scheduled_date:
            raise BusinessException(
                f"Start date ({start_date}) cannot precede the scheduled date ({scheduled_date})."
            )

    @staticmethod
    def validate_complete_transition(
        current_status: MaintenanceStatus, 
        completion_date: date, 
        start_date: Optional[date]
    ) -> None:
        """Validate if a maintenance task can be completed."""
        if current_status == MaintenanceStatus.CANCELLED:
            raise BusinessException("Cannot complete a cancelled maintenance task.")
        if current_status == MaintenanceStatus.COMPLETED:
            raise BusinessException("Maintenance is already completed.")
        if current_status == MaintenanceStatus.SCHEDULED:
            raise BusinessException("Cannot complete a task that has not been started.")
        
        if start_date and completion_date < start_date:
            raise BusinessException(
                f"Completion date ({completion_date}) cannot precede the start date ({start_date})."
            )

    @staticmethod
    def validate_cancel_transition(current_status: MaintenanceStatus) -> None:
        """Validate if a maintenance task can be cancelled."""
        if current_status == MaintenanceStatus.COMPLETED:
            raise BusinessException("Cannot cancel an already completed maintenance task.")
        if current_status == MaintenanceStatus.CANCELLED:
            raise BusinessException("Maintenance is already cancelled.")
