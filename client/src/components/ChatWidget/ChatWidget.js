import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import { h1, btn } from '../../style/globalCss'

function ChatWidget({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState('')
    const [messageList, setMessageList] = useState([])

    const sendMessage = async () => {
        
        if (currentMessage !== '') {
            
            const messageData = {
                sender: username,
                room: room,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
            }
            alert(username)
            await socket.emit('chatToServer', messageData)
            // setMessageList((list) => [...list, messageData]);
            setCurrentMessage('')
        }
    }

    useEffect(() => {
        socket.on('chatToClient', (data) => {
            console.log(data)
            setMessageList((list) => [...list, data])
        })
    }, [socket])

    return (
        <div>
            <div className='message__container'>
                <ScrollToBottom>
                    {messageList.map((messageContent) => {
                        return (
                            messageContent.sender === username ? (
                                <div>
                                    <div className='my__name'>
                                        <p>You - {messageContent.time}</p>
                                    </div>
                                    <div className='message__sender'>
                                        <div className='message'>
                                            <p>{messageContent.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className='sender__name'>
                                        <p>{messageContent.sender} - {messageContent.time}</p>
                                    </div>
                                    <div className='message__recipient'>
                                        <div className='message'>
                                            <p>{messageContent.message}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )
                    })}
                </ScrollToBottom>
            </div>
            <div>
                <div className='chat__footer'>
                    <div className='bar'>
                        <input
                            type="text"
                            className='message'
                            value={currentMessage}
                            placeholder="Type a message"
                            onChange={(event) => {
                                setCurrentMessage(event.target.value)
                            }}
                            onKeyDown={(event) => {
                                event.key === 'Enter' && sendMessage()
                            }}
                        />
                        <button className="sendBtn" onClick={sendMessage}>
                            {' '}
                            send{' '}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatWidget
