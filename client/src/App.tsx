import React, { useContext, useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { SocketContext } from './context/socket'
import { UserContext } from './context/userContext'
import { BrowserRouter, Navigate} from 'react-router-dom'
// import ProtectedRoute from './protected.routes';
import Login from './page/home'
import Menu from './page/menu'
import TwoFA from './page/tfa'
import './style/globalCss'
import './App.css'
// import axios from 'axios';
// import { ProtectedRoute } from './protected.route';
import RequireAuthRoute from './protected.route'

import Header from './components/Header'
import Home from './page/Home'
import Settings from './page/Settings'
import Footer from './components/Footer'
import Chat from './page/Chat'
import Error404 from './page/Error404'
import Friends from './page/Friends'
import StatsAndMatch from './page/StatsAndMatch'
import WatchLive from './page/WatchLive'
import OneConv from './components/DisplayConv/OneConv'
// import App from './page/App/App'
import PrintProfile from './page/Profile'
import GetAdminChannels from './requests/getAdminChannels'
import GetChannels from './requests/getChannels'
import GetUsers from './requests/getUsers'


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}
declare global {
  interface Window {
      config: object
  }
}

const App: React.FunctionComponent<Props> = () => {
  const [user, setUser] = useState({ id: '0', username: '', id42: '', avatar: 'anonymous.jpg', tFA_enabled: false })
  const sockContext = useContext(SocketContext)
  // const userContext = useContext(UserContext)
  // const navigate = useNavigate();
  const me = useContext(UserContext).user
  // useEffect(() => {
  //   const getUser = async () => {
  //     axios
  //       .get(`http://localhost:4000/auth/user`, {
  //         withCredentials: true
  //       })
  //       .then((res) => {
  //           console.log(res.data);
  //          userContext.setUser(res.data);
  //       })
  //       .catch((err) => console.log(err));
  //   };
  //   getUser();
  // }, []);
  // console.log("App.tsx: me", userContext.user);
  // const [activeChannel, setActiveChannel] = useState<Channel | undefined>();
  // const location = useLocation();
  // console.log("App.tsx: me", me);

  // online for the users
  useEffect(() => {
  sockContext.socketUser.emit('online', 'ok');
  }, [sockContext.socketUser]);

  // join own channel where all personnal requests will be received (like friend requests)
  useEffect(() => {
  sockContext.socketChat.emit('online', 'ok');
  }, [sockContext.socketChat, me.id]);

  // online for the main menu and the game
  useEffect(() => {
    sockContext.socketGame.emit('online', me.id);
  }, [sockContext.socketGame, me.id]);

  // prevent scrolling when playing pong (since we use the mouse/touchpad/touchscreen)
  // useEffect(() => {
  //   if (window.location.pathname.indexOf('/match') >= 0) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = 'visible';
  //   }
  // }, [location]);

  // const access = async (token) => {
  //   return await axios.post(
  //     "http://localhost:5000/access",
  //     {},
  //     { headers: { Authorization: `Bearer ${token}` } }
  //   );
  // };
  const JsonConfig = {
    headers: {
        Authorization:
            `Bearer ` +
            `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWQ0MiI6InN0cmluZyIsImlhdCI6MTY4ODU3NDE0MSwiZXhwIjoxNjg4NjEwMTQxfQ.8z7HdWtH6uZ-Bvv4sPbw125BlDs0TIB3TO7jnsdxGl0`,
    },
 }

window.config = JsonConfig
// console.log("test")
// console.log(GetChannels())

  return (
    <div className="App">
      {/* <ThemeProvider theme={darkTheme}>
        <CssBaseline /> */}
        
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
          <SocketContext.Provider value={sockContext}>
          
          {/* <BrowserRouter> */}
            {/* <Routes> */}
              {/* <Route path="/" element={parseInt(user.id) === 0 ? <Login /> : <Navigate to="/home" replace/> } /> */}
              {/* <Route path="/home" element={<RequireAuthRoute><Home /></RequireAuthRoute>} /> */}
            {/* </Routes> */}
            {user.id !== '0' && <Header />}
            <Routes>
              {/* <Route path="/" element={user.id === '' ? <Login /> : <Navigate to="/home" replace/> } /> */}
              {user.id !== '0' ? <Route path="/" element={<Navigate to="/home" replace={true}/>} /> : <Route path="/" element={<Login/>} />}
              {/* {user.id !== '0' && <Route path="/" element={<Navigate to="/home" replace={true}/>} />} */}
              <Route path="/home" element={<RequireAuthRoute><Home /></RequireAuthRoute>} />
              <Route path="/userparams" element={<RequireAuthRoute><Settings /></RequireAuthRoute>} />{' '}
              <Route path="/Friends" element={<RequireAuthRoute><Friends /></RequireAuthRoute>} />
              <Route path="/StatsAndMatch" element={<RequireAuthRoute><StatsAndMatch /></RequireAuthRoute>} />
              <Route path="/chat/" element={<RequireAuthRoute><Chat /></RequireAuthRoute>} />
              {/* <Route
                 path="/PrintProfile/:username"
                 element={<RequireAuthRoute><PrintProfile /></RequireAuthRoute>}
             /> */}
              <Route path="*" element={<RequireAuthRoute><Error404 /></RequireAuthRoute>} />
            </Routes>
         <Footer />
         {/* </BrowserRouter> */}
            {/* <Route path="/menu" element={
              <RequireAuthRoute>
                <Menu />
              </RequireAuthRoute>
            }/>
            <Route path="/tfa" element={
              <RequireAuthRoute>
                <TwoFA />
              </RequireAuthRoute>
            }/>

 */}
          {/* </Routes> */}
          </SocketContext.Provider>
        </UserContext.Provider>
      {/* </ThemeProvider> */}
    </div>
  )
}

export default App
