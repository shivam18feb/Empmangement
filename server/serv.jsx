// server.js

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
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
    console.error('Error connecting to MySQL:', err);
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
  const { firstName, lastName, email, department, position } = req.body;
  connection.query('INSERT INTO employees (firstName, lastName, email, department, position) VALUES (?, ?, ?, ?, ?)',
    [firstName, lastName, email, department, position],
    (err, result) => {
      if (err) {
        console.error('Error adding employee:', err);
        res.status(500).json({ error: 'Error adding employee' });
        return;
      }
      res.status(201).json({ message: 'Employee added successfully', id: result.insertId });
    });
});
app.use((req, res, next) => {
    const contentType = req.get('Accept');
    if (!contentType || contentType.indexOf('application/json') === -1) {
      res.status(406).json({ error: 'Only JSON responses are supported' });
    } else {
      next();
    }
  });
// Update an employee
app.put('/api/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    const { firstName, lastName, email, department, position } = req.body;
    connection.query(
      'UPDATE employees SET firstName=?, lastName=?, email=?, department=?, position=? WHERE id=?',
      [firstName, lastName, email, department, position, employeeId],
      (err, result) => {
        if (err) {
          console.error('Error updating employee:', err);
          res.status(500).json({ error: 'Error updating employee' });
          return;
        }
        res.json({ message: 'Employee updated successfully', id: employeeId });
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
        res.json({ message: 'Employee deleted successfully', id: employeeId });
      }
    );
  });
  

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
