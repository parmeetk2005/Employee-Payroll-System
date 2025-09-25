import SalaryStructure from '../models/SalaryStructure.js';
import Employee from '../models/Employee.js';

export const createOrUpdateSalary = async (req, res) => {
  const employeeId = req.body.employee;
  if (!employeeId) return res.status(400).json({ message: 'employee id required' });

  const emp = await Employee.findById(employeeId);
  if (!emp) return res.status(404).json({ message: 'Employee not found' });

  //salary structure
  let salary = await SalaryStructure.findOne({ employee: employeeId });
  if (!salary) {
    salary = await SalaryStructure.create(req.body);
    emp.salaryStructure = salary._id;
    await emp.save();
    return res.status(201).json(salary);
  }

  // update
  Object.assign(salary, req.body);
  await salary.save();
  res.json(salary);
};

export const getSalaryByEmployee = async (req, res) => {
  const empId = req.params.employeeId;
  const salary = await SalaryStructure.findOne({ employee: empId });
  if (!salary) return res.status(404).json({ message: 'Salary structure not found' });
  res.json(salary);
};
