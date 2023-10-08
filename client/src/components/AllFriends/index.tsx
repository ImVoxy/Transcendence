import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GetFriends from '../../requests/getFriends'
import PostAddBlocked from '../../requests/postAddBlocked'
import { btn, btnBlock } from '../../style/globalCss'
import { UserContext } from '../../context/userContext';
import { useContext } from "react"
import React from "react";

function AllFriends() {
    const me = useContext(UserContext).user;
    const userId = me.id
    const [getFriends] = GetFriends(userId)

    function BlockUserButton(user: any) {
        const [Userblocked, setUserblocked] = useState(true)
        const [errorAddBlock, setErrorAddBlock] = useState<string>('')
        function blockUser() {
            setUserblocked(!Userblocked)
            const [addBlocked] = PostAddBlocked(user.id)
            setErrorAddBlock(addBlocked.error)
        }

        return (
            <div>
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

    function StartNewConv(user: any) {
        function startIt() {
            //trucs a faire - eventuel fetch etc
        }

        return (
            <div>
                {/* {error && <p>{error}</p>} */}
                {
                    <button className={btn} onClick={startIt}>
                        Start a conv
                    </button>
                }
            </div>
        )
    }

    function SeeProfile(user: any) {
        const navigate = useNavigate()
        function startIt() {
            navigate(`/PrintProfile/${user.username}`)
        }

        return (
            <div>
                {
                    <button className={btn} onClick={startIt}>
                        See profile
                    </button>
                }
            </div>
        )
    }

    function Print() {
        return (
            <div>
                <ul className="list-group">
                    {getFriends.loading && <p>Loading ... </p>}
                    {!getFriends.loading && getFriends.error && <p>{getFriends.error}</p>}
                    {!getFriends.loading &&
                        !getFriends.error &&
                        getFriends.data?.map((request: any) => (
                            <li className="card list-group-item m-2 p-2 rounded bg-light" key={request.username}>
                                <h5 className="card-title">{request.username}, {request.id}</h5>
                                BOUTTON START CONV DOESNT WORK
                                {StartNewConv(request.id)}
                                {SeeProfile(request)}
                                {BlockUserButton(request.id)}
                            </li>
                        ))}
                </ul>
            </div>
        )
    }

    return <Print />
}

export default AllFriends
