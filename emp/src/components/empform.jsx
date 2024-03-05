import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Table } from "react-bootstrap";
import img from '../assets/ico.svg';
import "./emp.css";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    department: "",
    position: "",
    salary: "",
  });
  const [employees, setEmployees] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url =
        editingIndex !== null
          ? `http://localhost:3000/api/employees/${employees[editingIndex].id}`
          : "http://localhost:3000/api/employees";

      const method = editingIndex !== null ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (editingIndex !== null) {
          alert("Employee updated successfully");
          setEditingIndex(null);
        } else {
          alert("Employee added successfully");
        }
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          department: "",
          position: "",
          salary: "",
        });
        fetchEmployees();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error: " + error.message);
    }
  };

  const handleEdit = (employee) => {
    const index = employees.findIndex((emp) => emp.id === employee.id);
    setFormData({
      firstname: employee.firstname,
      lastname: employee.lastname,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      salary: employee.salary,
    });
    setEditingIndex(index);
  };

  const handleDelete = async (employeeId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/employees/${employeeId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const updatedEmployees = employees.filter(
          (employee) => employee.id !== employeeId
        );
        setEmployees(updatedEmployees);
        alert("Employee deleted successfully");
      } else {
        throw new Error("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error.message);
      alert("Error deleting employee: " + error.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/employees");
      if (response.ok) {
        const employeesData = await response.json();
        setEmployees(employeesData);
      } else {
        throw new Error("Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <Container fluid className="glassy-background mt-4 mb-4 ">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="form-container">
            <Form onSubmit={handleSubmit} className="custom-form">
              <img src={img} alt="React Image" className="w-25 mx-auto d-block" /> 
              <fieldset>
                <legend className="form-title">
                  <strong>Employees Management System</strong>
                </legend>
                <Form.Group controlId="formfirstname" className="custom-input-container">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    className="custom-input animated-input"
                    type="text"
                    placeholder="Enter first name"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formlastname" className="custom-input-container">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    className="custom-input animated-input"
                    type="text"
                    placeholder="Enter last name"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEmail" className="custom-input-container">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    className="custom-input animated-input"
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formDepartment" className="custom-input-container">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    className="custom-input animated-input"
                    type="text"
                    placeholder="Enter department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPosition" className="custom-input-container">
                  <Form.Label>Position</Form.Label>
                  <Form.Control
                    className="custom-input animated-input"
                    type="text"
                    placeholder="Enter position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formSalary" className="custom-input-container">
                  <Form.Label>Salary</Form.Label>
                  <Form.Control
                    className="custom-input animated-input"
                    type="text"
                    placeholder="Enter salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="submit-btn">
                  {editingIndex !== null ? "Update" : "Submit"}
                </Button>
              </fieldset>
            </Form>
          </div>
        </Col>
      </Row>

      <Container fluid>
        <Row className="justify-content-center mt-4">
          <Col md={10}>
            <h2 className="text-center mb-4">Employee List</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{employee.firstname}</td>
                    <td>{employee.lastname}</td>
                    <td>{employee.email}</td>
                    <td>{employee.department}</td>
                    <td>{employee.position}</td>
                    <td>{employee.salary}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleEdit(employee)}
                        style={{ marginRight: "5px" }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(employee.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default EmployeeForm;
