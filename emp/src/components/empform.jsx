import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';
import './emp.css';

const EmployeeManagementSystem = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: ''
  });
  const [validationError, setValidationError] = useState('');
  const [editIndex, setEditIndex] = useState(null); // State to track the index of the employee being edited

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setValidationError('Please fill out all required fields.');
      return;
    }
    if (!validateEmail(formData.email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (editIndex !== null) {
      // If editIndex is not null, it means we are editing an existing employee
      const updatedEmployees = [...employees];
      updatedEmployees[editIndex] = formData;
      setEmployees(updatedEmployees);
      setEditIndex(null); // Reset editIndex after editing
    } else {
      // If editIndex is null, it means we are adding a new employee
      setEmployees([...employees, formData]);
    }

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      position: ''
    });
    setValidationError('');
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleDelete = (index) => {
    const updatedEmployees = [...employees];
    updatedEmployees.splice(index, 1);
    setEmployees(updatedEmployees);
  };

  const handleEdit = (index) => {
    const employeeToEdit = employees[index];
    setFormData({ ...employeeToEdit }); // Populate form fields with the data of the employee being edited
    setEditIndex(index); // Set the index of the employee being edited
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-5" style={{ color: 'blue' }}>Employee Management System</h1>
          {validationError && <Alert variant="danger">{validationError}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="firstName">
                  <Form.Label style={{ color: 'green' }}>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="lastName">
                  <Form.Label style={{ color: 'green' }}>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="email">
              <Form.Label style={{ color: 'green' }}>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group controlId="department">
                  <Form.Label style={{ color: 'green' }}>Department</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="position">
                  <Form.Label style={{ color: 'green' }}>Position</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" className="mt-3" style={{ backgroundColor: 'red' }}>
              {editIndex !== null ? 'Update Employee' : 'Add Employee'} {/* Change button text based on edit mode */}
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={10} className="mx-auto">
          <h2 className="text-center mb-4" style={{ color: 'blue' }}>Employee List</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ color: 'green' }}>#</th>
                <th style={{ color: 'green' }}>First Name</th>
                <th style={{ color: 'green' }}>Last Name</th>
                <th style={{ color: 'green' }}>Email</th>
                <th style={{ color: 'green' }}>Department</th>
                <th style={{ color: 'green' }}>Position</th>
                <th style={{ color: 'green' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>{employee.position}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleDelete(index)}>Delete</Button>{' '}
                    <Button variant="warning" onClick={() => handleEdit(index)}>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeManagementSystem;
