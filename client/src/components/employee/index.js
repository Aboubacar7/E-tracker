import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DELETE_EMPLOYEE } from "../../utils/mutations";

import { useMutation, useQuery } from "@apollo/client";
import { QUERY_EMPLOYEE } from "../../utils/queries";
import { EDIT_EEMPLOYEE } from "../../utils/mutations";

export default function allEmployee() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editedEmployee, setEditedEmployee] = useState();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editEmployee] = useMutation(EDIT_EEMPLOYEE);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE);

  const handleDeleteClick = async (employeeId) => {
    try {
      const { data } = await deleteEmployee({
        variables: {
          id: employeeId,
        },
      });
      console.log(data);
      if (data.deleteEmployee && data.deleteEmployee.message) {
        window.location.reload();
      }
      console.log("Employee deleted:", data.deleteEmployee);
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  const handleEditEmployee = async (employeeId, updatedFields) => {
    try {
      const { data } = await editEmployee({
        variables: {
          _id: employeeId, 
          input: {
            _id: employeeId, 
            ...updatedFields,
          },
        },
      });
      console.log("Employee edited:", data.editEmployee);
    } catch (error) {
      console.error("Error editing employee:", error);
    }
  };

  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { loading, data } = useQuery(QUERY_EMPLOYEE);
  const employee = data?.employee || {};
  console.log(employee);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleEditClick = () => {
    setEditedEmployee({ ...selectedEmployee });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'manager' || name === 'role') {
      setEditedEmployee((prevEmployee) => ({
        ...prevEmployee,
        [name]: [{ title: value }],
      }));
    } else {
     
      setEditedEmployee((prevEmployee) => ({
        ...prevEmployee,
        [name]: value,
      }));
    }
  };
  const handleFormSubmit = async () => {
    console.log("Form submitted");
    
    if (editedEmployee && editedEmployee._id) {
      console.log("Edited Employee:", editedEmployee);
      
      try {
        await handleEditEmployee(editedEmployee._id, {
          firstName: editedEmployee.firstName || "",
          lastName: editedEmployee.lastName || "",
          roleTitle: editedEmployee.role[0]?.title || "",
          managerLastName: editedEmployee.manager[0]?.lastName|| "",
        });
        setSelectedEmployee(data.editEmployee);
        setEditedEmployee(null);
      } catch (error) {
        console.error("Error during mutation:", error);
      }
    } else {
      console.error("Invalid _id for editing employee.");
    }
  };
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>All Employees</h1>

      {selectedEmployee && !editedEmployee && (
        <Paper
          elevation={3}
          key={selectedEmployee._id}
          style={{ padding: "10px", marginBottom: "20px" }}
        >
          <Typography variant="h6">
            {selectedEmployee.firstName} {selectedEmployee.lastName}
          </Typography>
          {selectedEmployee.role && selectedEmployee.role[0] && (
            <Typography>Role: {selectedEmployee.role[0].title}</Typography>
          )}
          {selectedEmployee.role &&
            selectedEmployee.role[0] &&
            selectedEmployee.role[0].department &&
            selectedEmployee.role[0].department[0] && (
              <Typography>
                Department: {selectedEmployee.role[0].department[0].name}
              </Typography>
            )}
          {selectedEmployee.role && selectedEmployee.role[0] && (
            <Typography>Salary: {selectedEmployee.role[0].salary}</Typography>
          )}
          {selectedEmployee.manager && selectedEmployee.manager[0] ? (
            <Typography>
              Manager: {selectedEmployee.manager[0].firstName}
            </Typography>
          ) : (
            <Typography>Manager: No Manager</Typography>
          )}
          <Button variant="outlined" onClick={handleEditClick}>
            Edit
          </Button>
        </Paper>
      )}
      {editedEmployee ? (
        <Paper
          elevation={3}
          key={editedEmployee._id}
          style={{ padding: "10px", marginBottom: "20px" }}
        >
          <Typography variant="h6">
            {editedEmployee.firstName} {editedEmployee.lastName}
          </Typography>
          <form>
            <TextField
              name="firstName"
              label="First Name"
              value={editedEmployee.firstName || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              name="lastName"
              label="Last Name"
              value={editedEmployee.lastName || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              name="role"
              label="Role"
              value={editedEmployee.role[0]?.title || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              name="manager"
              label="Manager"
              value={
                editedEmployee.manager && editedEmployee.manager[0]
                  ? editedEmployee.manager[0]?.lastName
                  : ""
              }
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <Button onClick={handleFormSubmit} variant="outlined">
              Save
            </Button>
          </form>
        </Paper>
      ) : null}
      <Grid
        container
        spacing={3}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Grid item xs={8}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 750 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Role</TableCell>
                  <TableCell align="right">Department</TableCell>
                  <TableCell align="right">Manager</TableCell>
                  <TableCell align="right">Salary</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employee.map((employee) => (
                  <TableRow
                    key={employee._id}
                    onClick={() => handleRowClick(employee)}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {employee.firstName} {employee.lastName}{" "}
                    </TableCell>
                    <TableCell align="right">
                      {employee.role[0].title}
                    </TableCell>
                    <TableCell align="right">
                      {employee.role[0].department[0].name}
                    </TableCell>
                    <TableCell align="right">
                      {employee.manager && employee.manager[0]
                        ? employee.manager[0].firstName
                        : "No Manager"}
                    </TableCell>
                    <TableCell align="right">
                      {employee.role[0].salary}
                    </TableCell>
                    <TableCell align="right">
                      <Grid item xs={8}>
                        <DeleteIcon  onClick={() => handleDeleteClick(employee._id)}/>
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
}
