import Employee from '../models/Employee.js';
import SalaryStructure from '../models/SalaryStructure.js';

// Create employee (admin)
export const createEmployee = async (req, res) => {
  const { fullName, email, designation, department, dateOfJoining } = req.body;
  if (!fullName || !email) return res.status(400).json({ message: 'Name and email are required' });

  const existing = await Employee.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Employee with this email already exists' });

  const emp = await Employee.create({ fullName, email, designation, department, dateOfJoining });
  res.status(201).json(emp);
};

export const listEmployees = async (req, res) => {
  const list = await Employee.find().populate('salaryStructure');
  res.json(list);
};

export const getEmployee = async (req, res) => {
  const emp = await Employee.findById(req.params.id).populate('salaryStructure');
  if (!emp) return res.status(404).json({ message: 'Employee not found' });
  res.json(emp);
};

export const updateEmployee = async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) return res.status(404).json({ message: 'Employee not found' });

  Object.assign(emp, req.body);
  await emp.save();
  res.json(emp);
};

export const deleteEmployee = async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) return res.status(404).json({ message: 'Employee not found' });

  // Also delete salary structure if exists
  if (emp.salaryStructure) await SalaryStructure.findByIdAndDelete(emp.salaryStructure);
  await emp.deleteOne();

  res.json({ message: 'Employee deleted' });
};
