import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

function Home() {
  // State to hold the welcome message
  const [welcomeMessage, setWelcomeMessage] = useState('Welcome to the App!');

  // Function to change the welcome message
  const changeWelcomeMessage = () => {
    const messages = ['Hello!', 'Welcome back!', 'Enjoy your day!'];
    const randomIndex = Math.floor(Math.random() * messages.length);
    setWelcomeMessage(messages[randomIndex]);
  };

  // UseEffect to change the message every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      changeWelcomeMessage();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // State to hold the user's choice
  const [userChoice, setUserChoice] = useState('');

  // Function to handle user choice change
  const handleUserChoiceChange = (event) => {
    setUserChoice(event.target.value);
  };

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '200px',
        border: '5px solid #ccc',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#fff',
      }}
    >
      <h1 style={{ marginBottom: '20px' }}>{welcomeMessage}</h1>
      <div>
        <label htmlFor="userChoice">Select an option:</label>
        <select
          id="userChoice"
          value={userChoice}
          onChange={handleUserChoiceChange}
          style={{ marginRight: '10px' }}
        >
          <option value="">-- Select --</option>
          <option value="employees">All Employees</option>
          <option value="roles">All Roles</option>
          <option value="departments">All Departments</option>
        </select>
        {userChoice && (
          <button style={{ marginBottom: '10px' }}>
            <Link to={`/${userChoice}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              Go to {userChoice}
            </Link>
          </button>
        )}
      </div>
      <Button variant="contained" sx={{ ml: 32, mb: 5, fontSize: 15, margin: "0 auto", mt:5 }}>
        <Link to="/addEmployee" style={{ textDecoration: 'none', color: 'inherit' }}>
          Add Employee
        </Link>
      </Button>
    </main>
  );
}

export default Home;
