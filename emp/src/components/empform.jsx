import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
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
        const response = await fetch(
          `http://localhost:3000/api/employees/${employees[editingIndex].id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        if (response.ok) {
          alert("Employee updated successfully");
          setEditingIndex(null);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
      } else {
        // Otherwise, add new employee
        const response = await fetch("http://localhost:3000/api/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          alert("Employee added successfully");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
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
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error: " + error.message);
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
      salary: employeeToEdit.salary,
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
    <Container className="glassy-background mt-4 mb-4"> 
     <Row className="justify-content-center">
      <Col md={6}>
        <div className="form-container">
          <h2 className="form-title"><strong>Employees Management System</strong></h2>
          <Form onSubmit={handleSubmit}>
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
          </Form>
        </div>
      </Col>
    </Row>
    <Container fluid>
    <Row className="justify-content-center mt-4">
  <Col md={10}>
    <h2 className="text-center mb-4">Employee List</h2>
    <div className="table-responsive">
      <table className="table table-striped table-hover table-bordered">
        <thead className="thead-dark">
          <tr>
            <th className="text-center">S.no</th>
            <th className="text-center">First Name</th>
            <th className="text-center">Last Name</th>
            <th className="text-center">Email</th>
            <th className="text-center">Department</th>
            <th className="text-center">Position</th>
            <th className="text-center">Salary</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td className="text-center">{index + 1}</td>
              <td className="text-center">{employee.firstname}</td>
              <td className="text-center">{employee.lastname}</td>
              <td className="text-center">{employee.email}</td>
              <td className="text-center">{employee.department}</td>
              <td className="text-center">{employee.position}</td>
              <td className="text-center">{employee.salary}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleEdit(index)}
                >
                  Edit
                </Button>{" "}
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
      </table>
    </div>
  </Col>
</Row>
</Container>
    </Container>
  );
};

export default EmployeeForm;
