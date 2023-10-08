import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
import { Logout} from '@mui/icons-material';
import { SocketContext } from '../context/socket';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/userContext';
//import { useUser } from '../hooks/useUser';



export default function Menu() {
    const sockContext = React.useContext(SocketContext);
    const navigate = useNavigate();
    // const userContext = useContext(UserContext);
    const me = useContext(UserContext).user;
    
    sockContext.socketUser.connect();
    sockContext.socketChat.connect();
    sockContext.socketGame.connect();

    sockContext.socketUser.emit('test', 'ok');




    async function logout() {
    
        sockContext.socketChat.disconnect();
        sockContext.socketUser.disconnect();
        sockContext.socketGame.disconnect();

        await axios.get(`http://localhost:4000/auth/logout`, { withCredentials: true })
          .then((res) => {
            console.log(res.data.message);
          })
          .catch((err) => {
            console.log(err);
        });
        navigate(`/`);

    }

        
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    FT_TRANSCENDENCE {me.username}
                </Typography>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="end"
                    onClick={logout}
                >
                    <Logout />
                </IconButton>
            </Toolbar>
        </AppBar>
    )   
}