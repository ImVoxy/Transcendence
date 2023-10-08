import { createContext } from 'react'
import io, { type Socket } from 'socket.io-client'

interface Context {
  socketUser: Socket
  socketChat: Socket
  socketGame: Socket;
}

export const socketUser = io('ws://localhost:4000/users', { transports: ['websocket', 'users'], withCredentials: true })
export const socketChat = io('ws://localhost:4000/channels', { transports: ['websocket', 'channels'], withCredentials: true })
export const socketGame = io(`ws://localhost:4000/games`, { transports: ['websocket'], withCredentials: true });

export const SocketContext = createContext<Context>({
  socketUser,
  socketChat,
  socketGame,
})
