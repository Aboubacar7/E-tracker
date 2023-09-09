import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TableBody from "@mui/material/TableBody";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useMutation, useQuery } from "@apollo/client";
import { QUERY_DEPARTMENT } from "../../utils/queries";
import { EDIT_DEPARTMENT } from "../../utils/mutations"

export default function allDepartment() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { loading, data } = useQuery(QUERY_DEPARTMENT);
  const department = data?.department || {};
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editedDepartment, setEditedDepartment] = useState(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editDepartment] = useMutation(EDIT_DEPARTMENT);
  console.log(department);

  const handleEditDepartment = async (departmentId, updatedFields) => {
    try {
      const { data } = await editDepartment({
        variables: {
          _id: departmentId,
          input: {
            _id: departmentId,
            ...updatedFields,
          },
        },
      });
      console.log("Department edited:", data.editDepartment);
    } catch (error) {
      console.error("Error editing department:", error);
    }
  };

  const handleRowClick = (department) => {
    setSelectedDepartment(department);
    setEditedDepartment(null);
  };

  const handleEditClick = () => {
    setEditedDepartment({ ...selectedDepartment });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDepartment((prevDepartment) => ({
      ...prevDepartment,
      [name]: value,
    }));
  };

  const handleFormSubmit = async () => {
    console.log("Form submitted");

    if (editedDepartment && editedDepartment._id) {
      console.log("Edited Department:", editedDepartment);

      try {
        await handleEditDepartment(editedDepartment._id, {
          name: editedDepartment.name || "",
        });
        setSelectedDepartment(null);
        setEditedDepartment(null);
      } catch (error) {
        console.error("Error during mutation:", error);
      }
    } else {
      console.error("Invalid _id for editing department.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
      All Departments
    </Typography>
    {selectedDepartment && !editedDepartment && (
      <Paper
        elevation={3}
        key={selectedDepartment._id}
        style={{ padding: "10px", marginBottom: "20px" }}
      >
        <Typography variant="h6">{selectedDepartment.name}</Typography>
    
        <Button variant="outlined" onClick={handleEditClick}>
          Edit
        </Button>
      </Paper>
    )}

    {editedDepartment ? (
      <Paper
        elevation={3}
        key={editedDepartment._id}
        style={{ padding: "10px", marginBottom: "20px" }}
      >
        <Typography variant="h6">Edit Department</Typography>
        <form>
          <TextField
            name="name"
            label="Name"
            value={editedDepartment.name || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          {/* Add other department fields as needed */}
          <Button onClick={handleFormSubmit} variant="outlined">
            Save
          </Button>
        </form>
      </Paper>
    ) : null}
      <TableContainer
        component={Paper}
        sx={{ pt: 10, maxWidth: 550, margin: "0 auto" }}
      >
        <Table sx={{ minWidth: 550 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>Department</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {department &&
              department.map((department) => (
                <TableRow
                  key={department._id}
                  onClick={() => handleRowClick(department)}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: "pointer" }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ textAlign: "center" }}
                  >
                    {department.name}
                  </TableCell>
                  <TableCell align="right">
                    <Grid item xs={8}>
                      <DeleteIcon />
                      <DeleteForeverIcon />
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
