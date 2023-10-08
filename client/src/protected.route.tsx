// import React, { useState, useEffect, useContext, type FC } from 'react'
// import { UserContext } from './context/userContext'
// import type User from './interface/user.interface'
// import axios from 'axios'
// import { Navigate } from 'react-router-dom'

// interface FetchUserResponse {
//   user: User
//   error: string
// }
// const RequireAuthRoute: FC<{ children: React.ReactElement }> = ({ children }) => {
//   // Your hook to get current user and an error
//   const userIsLogged = useFetchUser()
//   console.log('App.tsx: userIsLogged', userIsLogged.user, userIsLogged.error)

//   if (userIsLogged.error.length > 0) {
//     return <Navigate to="/" replace />
//   }
//   return children
// }

// const useFetchUser = (): FetchUserResponse => {
//   const [error, setError] = useState('')
//   const { user, setUser } = useContext(UserContext)

//   useEffect(() => {
//     // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
//     const fetchUser = async () => {
//       try {
//         // Fetch user from the backend with jwt verification
//         const response =
//         await axios.get('http://localhost:4000/auth/user', { withCredentials: true })

//         // if (!response) {
//         //   throw new Error('Failed to get user')
//         // }

//         const userData: User = response.data
//         if (userData.id !== user.id) {
//           // Update user in the context only if it has changed
//           setUser(userData)
//         }
//       } catch (error) {
//         // Remove user from the context in case of an error
//         setUser({
//           id: '0',
//           username: '',
//           id42: '',
//           avatar: '',
//           tFA_enabled: false
//           // tFA_secret: ''
//         })
//         setError('Failed to fetch user')
//       }
//     }

//     void fetchUser()
//   }, [])

//   return { user, error }
// }

// export default RequireAuthRoute

import React, { useContext } from 'react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './context/userContext';
import axios from 'axios';
import User from './interface/user.interface';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [page, setPage] = useState<JSX.Element>(<></>);
  const userContext = useContext(UserContext);
  useEffect(() => {
    const getUser = async () => {
      console.log('protected routes', userContext);
      axios
        .get<User>(`http://localhost:4000/auth/user`, {
          transport: 'websocket',
          withCredentials: true
        })
        .then((res) => {
          console.log('protected routes data', res.data);
          userContext.setUser(res.data);
          setPage(children);
        })
        .catch((err) => {
          setPage(<Navigate to="/home" replace />);
          console.log('protected routes', err);
      });
    };
    getUser();
  }, []);

  return page;
}