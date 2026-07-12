/**
 * Domain model class representing an EAM asset assignment.
 */
export class AssignmentModel {
  /**
   * @param {Object} [params={}]
   * @param {string} [params.assignmentId='']
   * @param {string} [params.assetCode='']
   * @param {string} [params.assetName='']
   * @param {string} [params.employeeName='']
   * @param {string} [params.department='']
   * @param {string} [params.assignedDate='']
   * @param {string} [params.expectedReturnDate='']
   * @param {string|null} [params.actualReturnDate=null]
   * @param {string} [params.status='Assigned']
   * @param {string} [params.assignedBy='']
   * @param {string} [params.remarks='']
   * @param {string|null} [params.returnCondition=null]
   */
  constructor({
    assignmentId = '',
    assetCode = '',
    assetName = '',
    employeeName = '',
    department = '',
    assignedDate = '',
    expectedReturnDate = '',
    actualReturnDate = null,
    status = 'Assigned',
    assignedBy = '',
    remarks = '',
    returnCondition = null,
  } = {}) {
    this.assignmentId = assignmentId;
    this.assetCode = assetCode;
    this.assetName = assetName;
    this.employeeName = employeeName;
    this.department = department;
    this.assignedDate = assignedDate;
    this.expectedReturnDate = expectedReturnDate;
    this.actualReturnDate = actualReturnDate;
    this.status = status;
    this.assignedBy = assignedBy;
    this.remarks = remarks;
    this.returnCondition = returnCondition;
  }
}
