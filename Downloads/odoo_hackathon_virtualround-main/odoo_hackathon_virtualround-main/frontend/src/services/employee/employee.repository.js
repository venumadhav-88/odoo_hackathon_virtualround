import { MOCK_EMPLOYEES } from '@/mocks/employees.mock';
import { assignmentRepository } from '../assignment/assignment.repository';

let employees = [...MOCK_EMPLOYEES];

const delay = () =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (800 - 500 + 1)) + 500)
  );

/**
 * Repository managing employee/custodian directory in-memory with delay simulations.
 */
export const employeeRepository = {
  /**
   * Reads all employees, calculating dynamic custody counts from active assignments.
   * @returns {Promise<Object[]>}
   */
  async getEmployees() {
    await delay();

    const activeAssignments = await assignmentRepository.getAssignments();

    return employees.map((emp) => {
      const activeCount = activeAssignments.filter(
        (asg) =>
          asg.employeeName.toLowerCase() === emp.name.toLowerCase() &&
          (asg.status === 'Assigned' || asg.status === 'Overdue')
      ).length;

      return {
        ...emp,
        assignedAssetsCount: activeCount,
      };
    });
  },

  /**
   * Registers a new custodian.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async addEmployee(data) {
    await delay();
    const newEmp = {
      ...data,
      id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      assignedAssetsCount: 0,
    };
    employees.push(newEmp);
    return newEmp;
  },

  /**
   * Edits employee fields.
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async updateEmployee(id, data) {
    await delay();
    employees = employees.map((emp) => (emp.id === id ? { ...emp, ...data } : emp));
    return employees.find((emp) => emp.id === id);
  },

  /**
   * Deregisters a custodian.
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async deleteEmployee(id) {
    await delay();
    const emp = employees.find((e) => e.id === id);
    if (!emp) throw new Error('Employee not found');
    employees = employees.filter((e) => e.id !== id);
    return emp;
  },
};
