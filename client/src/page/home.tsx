import React, { useState } from 'react';
// import { SocketContext } from '../context/socket';
import { Chip, Paper, Switch } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import FaceIcon from '@mui/icons-material/Face';
// import LoginIcon from '@mui/icons-material/Login';
// import { Button } from '@mui/material';
// import axios from 'axios';

import Signup from './signup';
import SchoolLogin from './schoolLogin';



// import { ParticleBackground } from './particle.background';







const Home: React.FC = () => {
  const [checked, setChecked] = useState(true);

  const handleChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="Home">
      <Paper elevation={3} style={{ alignItems: "center", padding: "10px", paddingBottom: "50px", width: 300 }}>
        <div>
          {checked ? (
            <Chip
              icon={<LockIcon />}
              label="Log In"
              variant="outlined"
              color="info"
            />
          ) : (
            <Chip
              icon={<FaceIcon />}
              label="Test In"
              variant="outlined"
              color="info"
            />
          )}
          <br />
          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
        {checked ? <SchoolLogin /> : <Signup />}
      </Paper>
    </div>
  );
}

export default Home;