import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { CREATE_DEPARTMENT } from '../../utils/mutations';
import { useMutation, useQuery } from '@apollo/client';


export default function AddDepartmentCard() {
  const [formState, setFormState] = useState({
    name: '',
  });

  const [createDepartment, { loading, error }] = useMutation(CREATE_DEPARTMENT);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await createDepartment({
        variables: {
          input: {
            name: formState.name,
          },
        },
      });

      console.log('Department added:', data.createDepartment);
      setFormState({ name: '' });
    } catch (err) {
      console.error('Error adding department:', err.message);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <Card sx={{ maxHeight: 700, maxWidth: 700, justifyContent: 'flex-start', alignItems: 'center', ml: 40, mt: 15 }}>
      <Typography variant="h3" gutterBottom sx={{ justifyContent: 'center', display: 'flex' }}>
        AddDepartment
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
        <TextField
          sx={{ fontSize: '200' }}
          id="outlined-multiline-flexible"
          label="DepartmentName"
          name='name'
          value={formState.name}
          multiline
          maxRows={4}
          size="large"
          onChange={handleInputChange}
        />
        <Button type='submit' variant="contained" sx={{ ml: 32, mb: 5, fontSize: 25, margin: "0 auto"  }}>
          Contained
        </Button>
      </Box>
    </Card>
  );
};
