import { AssignmentModel } from '@/models/assignment.model';

/**
 * Mapper utility separating API/repository structures from cleaner domain representations.
 */
export const assignmentMapper = {
  /**
   * Maps a raw repository assignment object to an AssignmentModel instance.
   * @param {Object} raw - Repository row representation.
   * @returns {AssignmentModel} Domain representation.
   */
  toDomain(raw) {
    if (!raw) return null;
    return new AssignmentModel({
      assignmentId: raw.assignmentId,
      assetCode: raw.assetCode,
      assetName: raw.assetName,
      employeeName: raw.employeeName,
      department: raw.department,
      assignedDate: raw.assignedDate,
      expectedReturnDate: raw.expectedReturnDate,
      actualReturnDate: raw.actualReturnDate,
      status: raw.status,
      assignedBy: raw.assignedBy,
      remarks: raw.remarks,
      returnCondition: raw.returnCondition,
    });
  },

  /**
   * Maps a domain model instance back to a persistence structure.
   * @param {AssignmentModel} domain - Clean domain assignment model.
   * @returns {Object} Database repository persistence model.
   */
  toPersistence(domain) {
    if (!domain) return null;
    return {
      assignmentId: domain.assignmentId,
      assetCode: domain.assetCode,
      assetName: domain.assetName,
      employeeName: domain.employeeName,
      department: domain.department,
      assignedDate: domain.assignedDate,
      expectedReturnDate: domain.expectedReturnDate,
      actualReturnDate: domain.actualReturnDate,
      status: domain.status,
      assignedBy: domain.assignedBy,
      remarks: domain.remarks,
      returnCondition: domain.returnCondition,
    };
  },
};
