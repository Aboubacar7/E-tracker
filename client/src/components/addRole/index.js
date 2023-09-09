import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { CREATE_ROLE } from '../../utils/mutations'
import { useMutation, useQuery } from '@apollo/client';



export default function AddRoleCard() {
  const [formState, setFormState] = useState({
    title: '',
    salary: '',
    departmentName: '',
  });

  const [createRole, { loading, error }] = useMutation(CREATE_ROLE);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  console.log('Form submitted!');
  
    const { title, salary, departmentName } = formState;
  
    if (!title || !salary || !departmentName) {
      console.error('Please fill in all the required fields.');
      return;
    }
  
    try {
      const { data } = await createRole({
        variables: {
          input: {
            title,
            salary: parseFloat(salary),
            departmentName: departmentName,
          },
        },
      });
      if (!data) {
        console.error('Error adding role: No data received.');
        return;
      }
  
      // Handle the response data as needed
      console.log('Role added:', data.createRole);
  
      // Reset the form fields after successful submission
      setFormState({ title: '', salary: '', departmentName: '' });
    } catch (err) {
      // Handle errors if needed
      console.error('Error adding role:', err.message);
    }
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <Card sx={{ maxHeight: 700, maxWidth: 700, justifyContent: 'flex-start', alignItems: 'center', ml: 40, mt: 15 }}>
      <Typography variant="h3" gutterBottom sx={{ justifyContent: 'center', display: 'flex' }}>
        AddRole
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
            label="Title"
            name="title"
            value={formState.title}
            onChange={handleInputChange}
            multiline
            maxRows={4}
          />
          <TextField
            id="outlined-textarea"
            label="Salary"
            name="salary"
            value={formState.salary}
            onChange={handleInputChange}
            placeholder="Placeholder"
            multiline
          />
        </div>
        <div>
          <TextField
            id="filled-multiline-flexible"
            label="Department"
            name="departmentName"
            value={formState.departmentName}
            onChange={handleInputChange}
            multiline
            maxRows={4}
            variant="filled"
          />
        </div>
        <Button type="submit" variant="contained" sx={{ ml: 30, mb: 5, fontSize: 25, margin: "0 auto"  }}>
          Contained
        </Button>
      </Box>
    </Card>
  );
}