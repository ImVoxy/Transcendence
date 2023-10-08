import { useState } from 'react'
import axios from 'axios'
import GetBlocked from '../../requests/getBlocked'
import { h1, btn } from '../../style/globalCss'
import React from "react";
import { useContext } from "react"
import { UserContext } from '../../context/userContext';

function BlockedFriends() {
    const me = useContext(UserContext).user;
    const userId = me.id
    const [getBlocked] = GetBlocked(userId)

    function UnblockButton(target: string) {
        const [error, setError] = useState<any>('')
        const [loading, setLoading] = useState(true)
        const [unblockFriend, setUnblockFriend] = useState(true)
        function UnblockFriend() {
            setUnblockFriend(!unblockFriend)
            const fetchData = async () => {
                setLoading(true)
                await axios
                    .delete(`/users/` + userId + `/remove_blocked`, {
                        headers: {
                            //Token de celui qu'on veut deblock (comme pour delete friend request) (ici, 5)
                            Authorization: `Bearer ` + `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWQ0MiI6InN0cmluZyIsImlhdCI6MTY4NTM3Mzg3MiwiZXhwIjoxNjg1NDA5ODcyfQ.UsyPlujRy6opEbF1UpHqv7eOBDhtdKQ18STqz5Hqc64`,
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
        }

        return (
            <div>
                {/* dans blocked : colomn A = a celui qui a bloqué // B: celui qui a ete bloqué par A*/}

                {error && <p>{error}</p>}
                {!error && unblockFriend && (
                    <button className={btn} onClick={UnblockFriend}>
                        Unblock Friend
                    </button>
                )}
                {!error && !unblockFriend && <p>Friend Unblocked (reload page)</p>}
            </div>
        )
    }

    function Print() {
        return (
            <div>
                <ul className="list-group">
                    {getBlocked.loading && <p>Loading ... </p>}
                    {!getBlocked.loading && getBlocked.error && <p>{getBlocked.error}</p>}
                    {!getBlocked.loading &&
                        !getBlocked.error &&
                        getBlocked.data.blocked?.map((request: any) => (
                            <li className="card list-group-item m-2 p-2 rounded bg-light" key={request.username}>
                                <h5 className="card-title">
                                    {request.username}, {request.id}
                                </h5>
                                {UnblockButton(request.id)}
                            </li>
                        ))}
                </ul>
            </div>
        )
    }

    return <Print />
}

export default BlockedFriends
