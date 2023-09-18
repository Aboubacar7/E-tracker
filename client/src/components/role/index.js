import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { EDIT_ROLE } from "../../utils/mutations"
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_ROLE } from "../../utils/queries";
import { DELETE_ROLE } from "../../utils/mutations";

export default function allRole() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedRole, setSelectedRole] = useState(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editedRole, setEditedRole] = useState(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [deleteRole] = useMutation(DELETE_ROLE);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { loading, data } = useQuery(QUERY_ROLE);
  const role = data?.role || {};
  console.log(role);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editRole] = useMutation(EDIT_ROLE);

  const handleDeleteClick = async (roleId) => {
    try {
      const { data } = await deleteRole({
        variables: {
          id: roleId,
        },
      });
      console.log(data);
        window.location.reload();
     
      console.log("Employee deleted:", data.deleteRole);
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };


  const handleEditRole = async (roleId, updatedFields) => {
    try {
      const { data } = await editRole({
        variables: {
          _id: roleId,
          input: {
            _id: roleId,
            ...updatedFields,
          },
        },
      });
      console.log("Role edited:", data.editRole);
    } catch (error) {
      console.error("Error editing role:", error);
    }
  };

  const handleRowClick = (role) => {
    setSelectedRole(role);
    setEditedRole(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleEditClick = () => {
    setEditedRole({ ...selectedRole });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'departmentId') {
      const updatedDepartment = { ...editedRole.department[0], name: value };
      setEditedRole((prevRole) => ({
        ...prevRole,
        department: [updatedDepartment],
      }));
    } else {
      setEditedRole((prevRole) => ({
        ...prevRole,
        [name]: value,
      }));
    }
  };  

  const handleFormSubmit = async () => {
    console.log("Form submitted");
  
    if (editedRole && editedRole._id) {
      console.log("Edited Role:", editedRole);
  
      try {
        const numericSalary = parseFloat(editedRole.salary);
        if (isNaN(numericSalary)) {
          console.error("Invalid salary value.");
          return;
        }
  
        await handleEditRole(editedRole._id, {
          title: editedRole.title || "",
          salary: numericSalary,
          departmentName: editedRole.department[0]?.name || "",
        });
        setSelectedRole(null);
        setEditedRole(null);
      } catch (error) {
        console.error("Error during mutation:", error);
      }
    } else {
      console.error("Invalid _id for editing role.");
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
      <Typography
        variant="h3"
        gutterBottom
        sx={{ justifyContent: "center", display: "flex", pt: 13 }}
      >
        AllRoles
      </Typography>
      {selectedRole && !editedRole && (
        <Paper
          elevation={3}
          key={selectedRole._id}
          style={{ padding: "10px", marginBottom: "20px" }}
        >
          <Typography variant="h6">{selectedRole.title}</Typography>
          <Typography>Salary: {selectedRole.salary}</Typography>
          <Typography>Department: {selectedRole.department?.name}</Typography>
          <Button variant="outlined" onClick={handleEditClick}>
            Edit
          </Button>
        </Paper>
      )}

      {editedRole ? (
        <Paper
          elevation={3}
          key={editedRole._id}
          style={{ padding: "10px", marginBottom: "20px" }}
        >
          <Typography variant="h6">Edit Role</Typography>
          <form>
            <TextField
              name="title"
              label="Title"
              value={editedRole.title || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              name="salary"
              label="Salary"
              value={editedRole.salary || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              name="departmentId"
              label="Department"
              value={editedRole.department[0]?.name || ""}
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
      <TableContainer
        component={Paper}
        sx={{ pt: 10, maxWidth: 750, margin: "0 auto" }}
      >
        <Table sx={{ minWidth: 550 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Salary</TableCell>
              <TableCell align="right">Department</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {role &&
              role.map((role) => (
                <TableRow
                  key={role._id}
                  onClick={() => handleRowClick(role)}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: "pointer" }}
                >
                  <TableCell component="th" scope="row">
                    {role.title}
                  </TableCell>
                  <TableCell align="right"> {role.salary}</TableCell>
                  <TableCell align="right">{role.department[0].name}</TableCell>
                  <TableCell align="right">
                    <Grid item xs={8}>
                      <DeleteIcon  onClick={() => handleDeleteClick(role._id)} />
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
  );
}
