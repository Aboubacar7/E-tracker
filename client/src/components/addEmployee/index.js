import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { CREATE_EMPLOYEE } from "../../utils/mutations";

export default function AddEmploeeCard() {
  const [expanded, setExpanded] = React.useState(false);
  const [createEmployee] = useMutation(CREATE_EMPLOYEE);


  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    roleTitle: '',
    managerLastName: '',
  });

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    console.log('Form submitted!');
    console.log('Form data:', formState);

    createEmployee({
      variables: {
        input: {
          firstName: formState.firstName,
          lastName: formState.lastName,
          roleTitle: formState.roleTitle,
          managerLastName: formState.managerLastName,
        },
      },
    })
      .then((result) => {
        console.log('Employee added:', result.data.createEmployee);
        setFormState({
          firstName: '',
          lastName: '',
          roleTitle: '',
          managerLastName: '',
        });
      })
      .catch((error) => {
        console.error('Error adding employee:', error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <Card sx={{ maxHeight: 750, maxWidth: 700,  height: 350, justifyContent: 'flex-start', alignItems: 'center', ml: 40, mt: 15 }}>
      <Typography variant="h3" gutterBottom sx={{ justifyContent: 'center', display: 'flex' }}>
        AddEmployee
      </Typography>
      <Box
        component="form"
        onSubmit={handleFormSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          '& .MuiTextField-root': { my: 2, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            id="outlined-multiline-flexible"
            label="firstName"
            name="firstName"
            value={formState.firstName}
            onChange={handleInputChange}
            multiline
            maxRows={4}
          />
          <TextField
            id="outlined-textarea"
            label="lastName"
            name="lastName"
            value={formState.lastName}
            onChange={handleInputChange}
            placeholder="Placeholder"
            multiline
          />
        </div>
        <div>
          <TextField
            id="filled-multiline-flexible"
            label="role"
            name="roleTitle"
            value={formState.roleTitle}
            onChange={handleInputChange}
            multiline
            maxRows={4}
            variant="filled"
          />
          <TextField
            id="filled-textarea"
            label="manager LastName"
            name="managerLastName"
            value={formState.managerLastName}
            onChange={handleInputChange}
            placeholder="Placeholder"
            multiline
            variant="filled"
          />
        </div>

        <Button type="submit" variant="contained" sx={{ ml: 30, mb: 5, fontSize: 25, margin: "0 auto"  }}>
          Contained
        </Button>
      </Box>
    </Card>
  );
};