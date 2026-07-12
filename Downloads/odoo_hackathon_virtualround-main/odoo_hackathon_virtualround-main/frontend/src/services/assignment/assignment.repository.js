import { MOCK_ASSIGNMENTS } from '@/mocks/assignments.mock';
import { assetRepository } from '../asset/asset.repository';

let assignments = [...MOCK_ASSIGNMENTS];

const delay = () =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (800 - 500 + 1)) + 500)
  );

/**
 * In-memory repository simulating backend database transactions for assignments.
 * Session-scoped: refreshes back to initial mock datasets on page reload.
 */
export const assignmentRepository = {
  /**
   * Retrieves all assignments.
   * @returns {Promise<Array>} List of raw assignment data.
   */
  async getAssignments() {
    await delay();
    return [...assignments];
  },

  /**
   * Assigns an asset to an employee.
   * Sets the asset's status to 'Assigned' and links the custodian name.
   * @param {Object} data - Form assignment details.
   * @returns {Promise<Object>} The persisted assignment record.
   */
  async assignAsset(data) {
    await delay();

    // Check if the asset is already assigned
    const activeAssignment = assignments.find(
      (a) => a.assetCode === data.assetCode && (a.status === 'Assigned' || a.status === 'Overdue')
    );
    if (activeAssignment) {
      throw new Error('This asset is currently assigned to another custodian.');
    }

    const newAssignment = {
      ...data,
      assignmentId: `asg-${Date.now()}`,
      status: 'Assigned',
      actualReturnDate: null,
      returnCondition: null,
      assignedBy: 'Alex Carter', // Standard system user placeholder
    };

    assignments.unshift(newAssignment);

    // Sync status with asset repository
    try {
      const assetsList = await assetRepository.getAssets();
      const targetAsset = assetsList.find((a) => a.assetCode === data.assetCode);
      if (targetAsset) {
        await assetRepository.updateAsset(targetAsset.id, {
          status: 'Assigned',
          assignedTo: data.employeeName,
        });
      }
    } catch (err) {
      console.error('Failed to sync asset status on assignAsset:', err);
    }

    return newAssignment;
  },

  /**
   * Returns an assigned asset.
   * Sets the status of the assignment to 'Returned' and updates the asset state based on condition.
   * @param {string} assignmentId - Uniqueness identifier.
   * @param {Object} details - Condition and Remarks.
   * @returns {Promise<Object>} The updated assignment record.
   */
  async returnAsset(assignmentId, { condition, remarks }) {
    await delay();

    const index = assignments.findIndex((a) => a.assignmentId === assignmentId);
    if (index === -1) {
      throw new Error('Assignment not found.');
    }

    const assignment = assignments[index];
    const updatedAssignment = {
      ...assignment,
      status: 'Returned',
      actualReturnDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      returnCondition: condition,
      remarks: remarks ? `${assignment.remarks} | Return remarks: ${remarks}` : assignment.remarks,
    };

    assignments[index] = updatedAssignment;

    // Sync status with asset repository based on return condition
    try {
      const assetsList = await assetRepository.getAssets();
      const targetAsset = assetsList.find((a) => a.assetCode === assignment.assetCode);
      if (targetAsset) {
        let newAssetStatus = 'Available';
        if (condition === 'Damaged') {
          newAssetStatus = 'Under Maintenance';
        } else if (condition === 'Lost') {
          newAssetStatus = 'Retired';
        }

        await assetRepository.updateAsset(targetAsset.id, {
          status: newAssetStatus,
          assignedTo: null,
        });
      }
    } catch (err) {
      console.error('Failed to sync asset status on returnAsset:', err);
    }

    return updatedAssignment;
  },

  /**
   * Cancels a pending or active assignment.
   * Sets status to 'Cancelled' and releases the asset back to 'Available'.
   * @param {string} assignmentId - Uniqueness identifier.
   * @returns {Promise<Object>} The cancelled assignment record.
   */
  async cancelAssignment(assignmentId) {
    await delay();

    const index = assignments.findIndex((a) => a.assignmentId === assignmentId);
    if (index === -1) {
      throw new Error('Assignment not found.');
    }

    const assignment = assignments[index];
    const updatedAssignment = {
      ...assignment,
      status: 'Cancelled',
      remarks: `${assignment.remarks} | Assignment cancelled.`,
    };

    assignments[index] = updatedAssignment;

    // Sync status with asset repository (revert to Available)
    try {
      const assetsList = await assetRepository.getAssets();
      const targetAsset = assetsList.find((a) => a.assetCode === assignment.assetCode);
      if (targetAsset) {
        await assetRepository.updateAsset(targetAsset.id, {
          status: 'Available',
          assignedTo: null,
        });
      }
    } catch (err) {
      console.error('Failed to sync asset status on cancelAssignment:', err);
    }

    return updatedAssignment;
  },
};
