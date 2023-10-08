import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { 
  Button, 
  FormControl, 
  IconButton, 
  Input, 
  InputAdornment, 
  InputLabel, 
  Stack, 
  Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {

  const [showPassword, setShowPassword] = useState(false);
  
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [formValid, setFormValid] = useState('');
  const [success, setSuccess] = useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const navigate = useNavigate();
  
  async function signupFake(usernameInput: string, passwordInput: string) {
    const data = { id42: usernameInput, username: usernameInput, password: passwordInput };
    await axios.post(`http://localhost:4000/auth/login`, data, { withCredentials: true })
  .then((res) => {
    if (res.data.tFA_enabled) navigate('/tfa');
    else navigate("/home");
  })
  .catch((err) => {
    console.log(err);
    return false;
  });
}

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSuccess('');
    
    if(usernameError || !usernameInput) {
      setFormValid('Username is only 2-25 letters');
      return;
    }
    else if (passwordError || !passwordInput) {
      setFormValid('Password is only 5-25 characters');
      return;
    }
    setFormValid('');
    

    signupFake(usernameInput, passwordInput);

    
    setSuccess('The form was submitted !');

    console.log(usernameInput);
    console.log(passwordInput);
  };

  const handleUsername = () => {
    if(
      !usernameInput ||  
      !/^[a-zA-Z]+$/.test(usernameInput) || 
      usernameInput.length < 2 || 
      usernameInput.length > 25 
      ) {
        setUsernameError(true);
        return;
      }
    setUsernameError(false);
  };

  const handlePassword = () => {
    if(
      !passwordInput || 
      passwordInput.length < 5 || 
      passwordInput.length > 25 
      ) {
        setPasswordError(true);
        return;
      }
    setPasswordError(false);
  };

  return (
    <div>
      <div style={{ marginTop: "10px" }}>
      
        <TextField 
          id="standard-basic"
          error={usernameError}
          label='Username'
          value={usernameInput}
          onChange={event => setUsernameInput(event.target.value)}
          onBlur={handleUsername}
          variant="standard" 
          fullWidth
          size='small'
        />
      </div>
      <div style={{marginTop: "5px"}}>
        <FormControl sx={{ width: '100%' }} variant="standard" >
          <InputLabel error={passwordError} htmlFor="standard-adornment-password">Password</InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={passwordInput}
            onChange={event => setPasswordInput(event.target.value)}
            onBlur={handlePassword}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </div>
      <div style={{marginTop: "10px"}}>
        <Button 
          onClick={handleSubmit}
          fullWidth 
          variant="contained" 
          startIcon={<LoginIcon />}
        >
          Sign Up 
        </Button>
      </div>
        {formValid && (
          <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
            <Alert severity="error">
              {formValid}
            </Alert>
          </Stack>
        )}
        {success && (
          <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
            <Alert severity="success">
              {success}
            </Alert>
          </Stack>
        )}
      </div>
  );
}
