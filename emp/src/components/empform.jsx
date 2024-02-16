import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import './emp.css';

const EmployeeForm = ({ onSubmit, formData, onInputChange, buttonText }) => (
  <Form onSubmit={onSubmit}>
    <Row>
      <Col md={6}>
        <Form.Group controlId="firstName">
          <Form.Label style={{ color: 'green' }}>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
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
            onChange={onInputChange}
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
        onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
          />
        </Form.Group>
      </Col>
    </Row>
    <Button variant="primary" type="submit" className="mt-3" style={{ backgroundColor: 'red' }}>
      {buttonText}
    </Button>
  </Form>
);

const EmployeeList = ({ employees, onDelete, onEdit }) => (
  <Table className="custom-table striped bordered hover">
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
            <Button variant="danger" onClick={() => onDelete(employee.id)}>Delete</Button>{' '}
            <Button variant="warning" onClick={() => onEdit(index)}>Edit</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

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
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees');
      if (Array.isArray(response.data)) {
        setEmployees(response.data);
      } else {
        console.error('Invalid data format received:', response.data);
        setValidationError('Invalid data format received from the server.');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setValidationError('Error fetching employees. Please try again.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editIndex !== null) {
        await axios.put(`/api/employees/${employees[editIndex].id}`, formData);
        const updatedEmployees = [...employees];
        updatedEmployees[editIndex] = formData;
        setEmployees(updatedEmployees);
        setEditIndex(null);
      } else {
        await axios.post('/api/employees', formData);
        setEmployees([...employees, formData]);
      }
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        position: ''
      });
    } catch (error) {
      console.error('Error handling form submission:', error);
      setValidationError('Error submitting the form. Please try again.');
    }
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/employees/${id}`);
      setEmployees(employees.filter(employee => employee.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
      setValidationError('Error deleting employee. Please try again.');
    }
  };

  const handleEdit = (index) => {
    setFormData(employees[index]);
    setEditIndex(index);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-5" style={{ color: 'blue' }}>Employee Management System</h1>
          {validationError && <Alert variant="danger">{validationError}</Alert>}
          <EmployeeForm
            onSubmit={handleSubmit}
            formData={formData}
            onInputChange={handleInputChange}
            buttonText={editIndex !== null ? 'Update Employee' : 'Add Employee'}
          />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={10} className="mx-auto">
          <h2 className="text-center mb-4" style={{ color: 'blue' }}>Employee List</h2>
          <EmployeeList
            employees={employees}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeManagementSystem;
 