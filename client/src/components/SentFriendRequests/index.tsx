import { useState } from 'react'
import GetFriendRequestsSent from '../../requests/getFriendRequestsSent'
import RemoveFriendRequestSent from '../../requests/removeFriendRequestSent'
import { h1, btn } from '../../style/globalCss'
import { UserContext } from '../../context/userContext';
import { useContext } from "react"
import React from "react";

function SentFriendRequests() {
    const me = useContext(UserContext).user;
    const userId = me.id
    const [friendRequestsSent] = GetFriendRequestsSent(userId)

    function CancelButton(user: any) {
        const [cancelRequest, setCancelRequest] = useState(true)
        const [errorRemoveFriendRequest, setErrorRemoveFriendRequest] = useState<string>('')

        function cancelFriend() {
            setCancelRequest(!cancelRequest)
            const [rmFriendRequest] = RemoveFriendRequestSent(user.id)
            setErrorRemoveFriendRequest(rmFriendRequest.error)
            window.location.reload()
        }

        return (
            <div>
                {/* dans friend req received : colomn A = a celui qui receive // B: celui qui a sent*/}
                {/* dans friend req sent : colomn A = a celui qui send // B: celui qui a receive*/}

                {cancelRequest && (
                    <button className={btn} onClick={cancelFriend}>
                        Cancel friend request
                    </button>
                )}
                {errorRemoveFriendRequest && <p>{errorRemoveFriendRequest}</p>}
                {!errorRemoveFriendRequest && !cancelRequest && <p>Request cancelled</p>}
            </div>
        )
    }

    function Print() {
        return (
            <div>
                <h4 className="card-subtitle text-secondary">Sent requests:</h4>
                <ul className="list-group">
                    {friendRequestsSent.loading && <p>Loading ... </p>}
                    {!friendRequestsSent.loading && friendRequestsSent.error && <p>{friendRequestsSent.error}</p>}
                    {!friendRequestsSent.loading &&
                        !friendRequestsSent.error &&
                        friendRequestsSent.data.friend_requests_sent?.map((request: any) => (
                            <li className='card list-group-item m-2 p-2 rounded bg-light' key={request.username}>
                                 <h5 className="card-title" >{request.username}, {request.id}</h5>
                                {CancelButton(request)}
                            </li>
                        ))}
                </ul>
            </div>
        )
    }

    return <Print />
}

export default SentFriendRequests
