import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import ChatWidget from '../../components/ChatWidget/ChatWidget'
import { h1, btn } from '../../style/globalCss'

const socket = io.connect('http://localhost:3000/chat');


// const socket = io.connect("http://host.docker.internal:3000");
// const socket = io.connect("http://host.docker.internal:3001");

function App() {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [showChat, setShowChat] = useState(false)

    const joinRoom = () => {
        if (name !== '' && room !== '') {
            socket.emit('joinRoom', room)
            setShowChat(true)
        }
    }

    return (
        <div>
            {!showChat ? (
                <div>
                    <h1> Join A Chat </h1>
                    <label>Name</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        onChange={(event) => {
                            setName(event.target.value)
                        }}
                    />
                    <label>Room ID</label>
                    <input
                        type="text"
                        placeholder="Room ID..."
                        onChange={(event) => {
                            setRoom(event.target.value)
                        }}
                    />
                    <button className={btn} onClick={joinRoom}>
                        {' '}
                        Join{' '}
                    </button>
                </div>
            ) : (
                <ChatWidget socket={socket} username={name} room={room} />
            )}
        </div>
    );
}

export default App
