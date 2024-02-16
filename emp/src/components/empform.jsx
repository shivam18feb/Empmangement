import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './emp.css';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    department: '',
    position: '',
    salary:''
  });
  const [employees, setEmployees] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); // New state to track the index being edited

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIndex !== null) {
        // If editingIndex is not null, update existing employee
        const response = await fetch(`http://localhost:3000/api/employees/${employees[editingIndex].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          alert('Employee updated successfully');
          setEditingIndex(null);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
      } else {
        // Otherwise, add new employee
        const response = await fetch('http://localhost:3000/api/employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          alert('Employee added successfully');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
      }
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        department: '',
        position: '',
        salary:''
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error:', error.message);
      alert('Error: ' + error.message);
    }
  };

  const handleEdit = (index) => {
    const employeeToEdit = employees[index];
    setFormData({
      firstname: employeeToEdit.firstname,
      lastname: employeeToEdit.lastname,
      email: employeeToEdit.email,
      department: employeeToEdit.department,
      position: employeeToEdit.position,
      salary: employeeToEdit.salary
    });
    setEditingIndex(index);
  };

  const handleDelete = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/employees/${employeeId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedEmployees = employees.filter(employee => employee.id !== employeeId);
        setEmployees(updatedEmployees);
        alert('Employee deleted successfully');
      } else {
        throw new Error('Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error.message);
      alert('Error deleting employee: ' + error.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/employees');
      if (response.ok) {
        const employeesData = await response.json();
        setEmployees(employeesData);
      } else {
        throw new Error('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <Container>
      <Row className="justify-content-center">
      <h2 className="text-center mb-4 mt-4">Employees Management System</h2>
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formfirstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formlastname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDepartment">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPosition">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter position"
                name="position"
                value={formData.position}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formSalary">
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editingIndex !== null ? 'Update' : 'Submit'}
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col md={10}>
          <h2 className="text-center mb-4">Employee List</h2>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Actions</th> {/* Added Actions column */}
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{employee.firstname}</td> {/* Fixed property name */}
                    <td>{employee.lastname}</td> {/* Fixed property name */}
                    <td>{employee.email}</td>
                    <td>{employee.department}</td>
                    <td>{employee.position}</td>
                    <td>{employee.salary}</td>
                    <td>
                      <Button variant="info" size="sm" onClick={() => handleEdit(index)}>Edit</Button>{' '}
                      <Button variant="danger" size="sm" onClick={() => handleDelete(employee.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeForm;
