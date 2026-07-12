import { assetMapper } from '../asset/asset.mapper';
import { assignmentMapper } from '../assignment/assignment.mapper';
import { maintenanceMapper } from '../maintenance/maintenance.mapper';

/**
 * Mapper utility mapping raw aggregate payloads into clean domain model arrays.
 */
export const reportsMapper = {
  /**
   * Maps raw aggregate dataset.
   * @param {Object} raw - Raw datasets structure.
   * @returns {Object} Domain datasets structure.
   */
  toDomain(raw) {
    if (!raw) return null;
    return {
      assets: (raw.assets || []).map(assetMapper.toDomain),
      assignments: (raw.assignments || []).map(assignmentMapper.toDomain),
      maintenance: (raw.maintenance || []).map(maintenanceMapper.toDomain),
    };
  },
};
