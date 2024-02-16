const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors middleware

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Use cors middleware
app.use(bodyParser.json());

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employee_management'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Routes
app.get('/api/employees', (req, res) => {
  connection.query('SELECT * FROM employees', (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      res.status(500).json({ error: 'Error fetching employees' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/employees', (req, res) => {
  const { firstname, lastname, email, department, position, salary } = req.body;
  connection.query(
    'INSERT INTO employees (firstname, lastname, email, department, position, salary) VALUES (?, ?, ?, ?, ?, ?)',
    [firstname, lastname, email, department, position, salary],
    (err, result) => {
      if (err) {
        console.error('Error adding employee:', err);
        res.status(500).json({ error: 'Error adding employee' });
        return;
      }
      res.status(201).json({ message: 'Employee added successfully', id: result.insertId });
    }
  );
});

// Update an employee
app.put('/api/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  const { firstname, lastname, email, department, position, salary } = req.body;
  connection.query(
    'UPDATE employees SET firstname=?, lastname=?, email=?, department=?, position=?, salary=? WHERE id=?',
    [firstname, lastname, email, department, position, salary, employeeId],
    (err, result) => {
      if (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Error updating employee' });
        return;
      }
      res.status(204).json({ message: 'Employee updated successfully', id: employeeId });
    }
  );
});

// Delete an employee
app.delete('/api/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  connection.query(
    'DELETE FROM employees WHERE id=?',
    [employeeId],
    (err, result) => {
      if (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ error: 'Error deleting employee' });
        return;
      }
      res.status(204).json({ message: 'Employee deleted successfully', id: employeeId });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
