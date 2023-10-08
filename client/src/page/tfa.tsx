import React, { useState } from 'react';
import { Alert, Paper, Snackbar } from '@mui/material';
import { MuiOtpInput } from 'mui-one-time-password-input';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const TwoFA: React.FC = () => {
  
  const [alert, setAlert] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  
  const handleChange = (newValue: string) => {
    setOtp(newValue);
  };
  
  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert(false);
  };
  
  // function refreshPage() {
  //   window.location.reload();
  // }
  
  async function handleComplete(otp: string) {
    console.log("OTP:", otp);
    const data = { code: otp };    
    await axios.post(`http://localhost:4000/auth/verify2fa`, data, { withCredentials: true })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .then((res) => {
    navigate('/menu');
  })
  .catch((err) => {
    console.log(err);
    // navigate('/tfa')
    setOtp('');
    setAlert(true);
    // refreshPage();
   
  }); 
  }


function matchIsNumeric(character: string) {
  const isNumber = typeof character === 'number'
  const isString = typeof character === 'string'
  return (isNumber || (isString && character !== '')) && !isNaN(Number(character))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validateChar = (character: string, _index: number) => {
  return matchIsNumeric(character)
}

  return (
    <><div className="tFA">
      <Paper elevation={3} style={{ alignItems: "center", padding: "10px", paddingBottom: "50px", width: 300 }}>
        <h3>Two Factor Authentication</h3>
        <MuiOtpInput
          value={otp}
          onChange={handleChange}
          onComplete={handleComplete}
          length={6}
          validateChar={validateChar}
          autoFocus={true}
        />
      </Paper>
      </div>
      <Snackbar open={alert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {'Wrong code, Authentication failed'}
        </Alert>
      </Snackbar>
    </>
  );
}

export default TwoFA;