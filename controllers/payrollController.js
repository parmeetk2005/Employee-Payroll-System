import Employee from '../models/Employee.js';
import SalaryStructure from '../models/SalaryStructure.js';
import Payslip from '../models/Payslip.js';
import { calculatePayroll } from '../utils/payrollCalculator.js';

/*
Generate payslip for a given employee, for a month (format: YYYY-MM)
If payslip already exists for the month, returns it.
Request example:
POST /api/payslip/generate
{
  "employeeId": "...",
  "month": "2025-09",
  "otherDeductions": 100
}
*/

export const generatePayslip = async (req, res) => {
  const { employeeId, month, otherDeductions } = req.body;
  if (!employeeId || !month) return res.status(400).json({ message: 'employeeId and month required' });

  const employee = await Employee.findById(employeeId);
  if (!employee) return res.status(404).json({ message: 'Employee not found' });

  const salary = await SalaryStructure.findOne({ employee: employeeId });
  if (!salary) return res.status(400).json({ message: 'Salary structure for employee missing' });

  // check for existing payslip
  const existing = await Payslip.findOne({ employee: employeeId, month });
  if (existing) return res.json(existing);

  const calc = calculatePayroll(salary.toObject(), otherDeductions || 0);

  const payslip = await Payslip.create({
    employee: employeeId,
    month,
    grossPay: calc.grossPay,
    deductions: calc.deductions,
    totalDeductions: calc.totalDeductions,
    netPay: calc.netPay
  });

  res.status(201).json(payslip);
};

export const getPayslipsForEmployee = async (req, res) => {
  const employeeId = req.params.employeeId;
  const slips = await Payslip.find({ employee: employeeId }).sort({ month: -1 });
  res.json(slips);
};

export const getPayslipById = async (req, res) => {
  const slip = await Payslip.findById(req.params.id).populate('employee');
  if (!slip) return res.status(404).json({ message: 'Payslip not found' });
  res.json(slip);
};
