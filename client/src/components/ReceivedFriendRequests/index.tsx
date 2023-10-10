import { useState } from 'react'
import axios from 'axios'
import GetFriendRequestsReceived from '../../requests/getFriendRequestsReceived'
import PostAddFriend from '../../requests/postAddFriend'
import PostAddBlocked from '../../requests/postAddBlocked'
import { btn, btnBlock } from '../../style/globalCss'
import { UserContext } from '../../context/userContext';
import { useContext } from "react"
import React from "react";

function ReceivedFriendRequests() {
    const me = useContext(UserContext).user;
    const userId = me.id
    const [friendRequestsReceived] = GetFriendRequestsReceived(userId)
    const [errorAddFriend, setErrorAddFriend] = useState<string>('')

    function ConfirmButton(user: any) {
        const [error, setError] = useState<any>('')
        const [loading, setLoading] = useState(true)
        const [confirmRequest, setConfirmRequest] = useState(true)
        const [Userblocked, setUserblocked] = useState(true)
        const [errorAddBlock, setErrorAddBlock] = useState<string>('')

        function confirmFriend() {
            setConfirmRequest(!confirmRequest)
            // // enlever l'ID des friend request
            const fetchData = async () => {
                setLoading(true)
                await axios
                    .delete(`/users/` + user.id + `/remove_friend_request`, {
                        headers: {
                            //Token de celui qui a envoye la friend request (ici, 4)
                            Authorization: `Bearer ` + `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWQ0MiI6InN0cmluZyIsImlhdCI6MTY4ODU3NDE0MSwiZXhwIjoxNjg4NjEwMTQxfQ.8z7HdWtH6uZ-Bvv4sPbw125BlDs0TIB3TO7jnsdxGl0`,
                        },
                    })
                    .then((response) => {
                        setLoading(false)
                    })
                    .catch((err) => {
                        console.log(err.message)
                        setError(err.message)
                    })
            }
            fetchData()
            const [addFriend] = PostAddFriend(user.id)
            setErrorAddFriend(addFriend.error)
        }

        function blockUser() {
            setUserblocked(!Userblocked)
            const [addBlocked] = PostAddBlocked(user.id)
            setErrorAddBlock(addBlocked.error)
        }

        return (
            <div className='col'>
                {/* dans friend req received : colomn A = a celui qui receive // B: celui qui a sent*/}
                {/* dans friend req sent : colomn A = a celui qui send // B: celui qui a receive*/}

                {confirmRequest && (
                    <button className={btn} onClick={confirmFriend}>
                        Confirm friend request
                    </button>
                )}
                {errorAddFriend && <p>{errorAddFriend}</p>}
                {!errorAddFriend && !confirmRequest && <p>Friend added !</p>}
                {Userblocked && (
                    <button className={btnBlock} onClick={blockUser}>
                        Block user
                    </button>
                )}
                {errorAddBlock && <p>{errorAddBlock}</p>}
                {!Userblocked && !errorAddBlock && <p>User blocked!</p>}
            </div>
        )
    }

    function Print() {
        return (
            <div className='mb-4'>
                <h4 className="card-subtitle text-secondary">Received requests: (1 et 4)</h4>
                <ul className='list-group'>
                    {friendRequestsReceived.loading && <p>Loading ... </p>}
                    {!friendRequestsReceived.loading && friendRequestsReceived.error && <p>{friendRequestsReceived.error}</p>}
                    {!friendRequestsReceived.loading &&
                        !friendRequestsReceived.error &&
                        friendRequestsReceived.data.friend_requests_received?.map((request: any) => (
                            <li className='card list-group-item m-2 p-2 rounded bg-light' key={request.username}>
                                <h5 className="card-title" >{request.username}, {request.id}</h5>
                                {ConfirmButton(request)}
                            </li>
                        ))}
                </ul>
            </div>
        )
    }

    return <Print />
}

export default ReceivedFriendRequests
