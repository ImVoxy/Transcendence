import { Link, useNavigate } from 'react-router-dom'
import React, { useContext } from "react";
import axios from 'axios';
import { UserContext } from '../../context/userContext'
import { SocketContext } from '../../context/socket';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { Logout} from '@mui/icons-material';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';

function Header() {
    const sockContext = React.useContext(SocketContext);
    const navigate = useNavigate();
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
    }

    function navHome() {
      navigate(`/home`);
      window.location.reload()
    }
    function navParams() {
      navigate(`/userparams`);
      window.location.reload()
    }
    function navFriends() {
      navigate(`/Friends`);
      window.location.reload()
  }
    function navStats() {
      navigate(`/StatsAndMatch`);
      window.location.reload()
  }
  function navChat() {
    navigate(`/Chat`);
    window.location.reload()
  }

    return (
        <AppBar position="static">
            
            <Toolbar>
            
            <Stack spacing={2} direction="row"> 
              <Button variant="outlined"
                color="inherit"
                onClick={navHome}
              >
                Home
              </Button>

              <Button variant="outlined"
                color="inherit"
                onClick={navParams}
              >
                Params
              </Button>

              <Button variant="outlined"
                color="inherit"
                onClick={navFriends}
              >
                Friends
              </Button>

              <Button variant="outlined"
                color="inherit"
                onClick={navStats}
              >
                Stats
              </Button>

              <Button variant="outlined"
                color="inherit"
                onClick={navChat}
              >
                Chat
              </Button>
            </Stack>
            

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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

    // return (
    //     <header>
    //         <nav className="border-bottom border-primary navbar navbar-expand-lg navbar-light bg-light fixed-top">
    //             <div className=" container-fluidcollapse navbar-collapse justify-content-center" id="navbarCenteredExample">
    //                 <ul className="navbar-nav mb-2 mb-lg-0">
    //                     <li className="nav-item">
    //                         {/* active */}
    //                         <Link className="nav-link" to="/home">
    //                             Home
    //                         </Link>
    //                     </li>
    //                     <li className="nav-item">
    //                         <Link className="nav-link" to="/userparams">
    //                             Settings
    //                         </Link>
    //                     </li>
    //                     <li className="nav-item">
    //                         <Link className="nav-link" to="/Friends">
    //                             Friends
    //                         </Link>
    //                     </li>
    //                     <li className="nav-item">
    //                         <Link className="nav-link" to="/StatsAndMatch">
    //                             Match History and stats
    //                         </Link>
    //                     </li>
    //                     <li className="nav-item">
    //                         <Link className="nav-link" to="/Chat">
    //                             Chat
    //                         </Link>
    //                     </li>
    //                     {/* <li className="nav-item">
    //                         <Link className="nav-link" to="/WatchGame">
    //                             Watch a live game
    //                         </Link>
    //                     </li> */}

    //                     {/* Change user in login (amontautparams) + cannot acces page if not logged in */}
    //                 </ul>
    //             </div>
    //         </nav>
    //         <br /> <br /> <br />
    //     </header>

    //     // <nav className="navbar navbar-expand-lg fixed-top">
    //     //     <div className="container-fluid">
    //     //         <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
    //     //             <div className="navbar-nav navbar-nav-scroll">
    //     //                 <Link className="nav-link active" to="/"> Home </Link>
    //     //                 <Link className="nav-link" to="/userparams"> Settings </Link>
    //     // Change user in login (amontautparams) + cannot acces page if not logged in
    //     //                 <Link className="nav-link" to="/Friends"> Friends </Link>
    //     //                 <Link className="nav-link" to="/StatsAndMatch"> Match History and stats </Link>
    //     //                 <Link className="nav-link" to="/Chat"> Chat </Link>
    //     //                 <Link className="nav-link" to="/WatchGame"> Watch a live game </Link>
    //     //             </div>
    //     //         </div>
    //     //     </div>
    //     // </nav> */}

    //     // <div>
    //     //     <nav  className="navbar navbar-default navbar-fixed-top">
    //     //         <Link to="/">Home </Link>
    //     //         <Link to="/userparams">Settings </Link>{' '}
    //     //         {/* Change user in login (amontautparams) + cannot acces page if not logged in*/}
    //     //         <Link to="/Friends">Friends </Link>
    //     //         <Link to="/StatsAndMatch">Match History and stats </Link>
    //     //         <Link to="/Chat">Chat </Link>
    //     //         <Link to="/WatchGame">Watch a live game </Link>
    //     //     </nav>
    //     // </div>
    // )
}

export default Header
