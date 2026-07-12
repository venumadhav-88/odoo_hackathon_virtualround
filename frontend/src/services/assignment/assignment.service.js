import { assignmentRepository } from './assignment.repository';
import { assignmentMapper } from './assignment.mapper';
import { notify } from '@/utils/notifications';
import { logger } from '@/utils/logger';

/**
 * Service orchestrating Asset Assignment operations.
 * Communicates with repositories and translates results into standard domain model structures.
 */
export const AssignmentService = {
  /**
   * Retrieves all assignments mapped to AssignmentModel domain instances.
   * @returns {Promise<AssignmentModel[]>}
   */
  async getAssignments() {
    try {
      const data = await assignmentRepository.getAssignments();
      return data.map(assignmentMapper.toDomain);
    } catch (error) {
      logger.error('AssignmentService.getAssignments failed:', error);
      notify.error('Failed to load assignments.');
      throw error;
    }
  },

  /**
   * Assigns an asset to an employee.
   * @param {Object} formData - Form raw data.
   * @returns {Promise<AssignmentModel>}
   */
  async assignAsset(formData) {
    try {
      const data = await assignmentRepository.assignAsset(formData);
      notify.success('Asset assigned successfully.');
      return assignmentMapper.toDomain(data);
    } catch (error) {
      logger.error('AssignmentService.assignAsset failed:', error);
      const message = error.message || 'Failed to assign asset.';
      notify.error(message);
      throw new Error(message);
    }
  },

  /**
   * Processes the return of an asset.
   * @param {string} assignmentId - Target ID.
   * @param {Object} details - Condition and remarks.
   * @returns {Promise<AssignmentModel>}
   */
  async returnAsset(assignmentId, details) {
    try {
      const data = await assignmentRepository.returnAsset(assignmentId, details);
      notify.success('Asset return processed successfully.');
      return assignmentMapper.toDomain(data);
    } catch (error) {
      logger.error('AssignmentService.returnAsset failed:', error);
      const message = error.message || 'Failed to return asset.';
      notify.error(message);
      throw new Error(message);
    }
  },

  /**
   * Cancels an assignment.
   * @param {string} assignmentId - Target ID.
   * @returns {Promise<AssignmentModel>}
   */
  async cancelAssignment(assignmentId) {
    try {
      const data = await assignmentRepository.cancelAssignment(assignmentId);
      notify.success('Assignment cancelled successfully.');
      return assignmentMapper.toDomain(data);
    } catch (error) {
      logger.error('AssignmentService.cancelAssignment failed:', error);
      const message = error.message || 'Failed to cancel assignment.';
      notify.error(message);
      throw new Error(message);
    }
  },
};
