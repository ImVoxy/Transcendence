import { createContext } from 'react'
import type User from '../interface/user.interface'

export interface context {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
}

export const UserContext = createContext<context>({
  user: {
    id: '0',
    username: '',
    id42: '',
    avatar: '',
    tFA_enabled: false
    // tFA_secret: ''
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {}
})
