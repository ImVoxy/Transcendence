import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import GetUsers from '../../requests/getUsers'
import GetFriends from '../../requests/getFriends'
import PostAddFriendRequest from '../../requests/postAddFriendRequest'
import PostAddBlocked from '../../requests/postAddBlocked'
import { h1, btn, card, row, ulRow } from '../../style/globalCss'
import PostChannel from '../../requests/postChannels'
import GetChannels from '../../requests/getChannels'
import GetUser from '../../requests/getUser'
import addMember from '../../requests/addMember'
import { UserContext } from '../../context/userContext';
import { useContext } from "react"
import React from "react";

function SearchAddFriends() {
    const me = useContext(UserContext).user;
    const userId = me.id
    const [currentUser] = GetUser(userId)
    const [channels] = GetChannels()
    const [channel, setChannel] = useState<any>('')
    const [getUsers] = GetUsers()
    const [getFriends] = GetFriends(userId)
    const [state, setstate] = useState<any>({
        query: '',
        list: [],
    })

    const handleChange = (e: any) => {
        if (!getUsers.loading && !getUsers.error) {
            const results = getUsers.data.filter((post: any) => {
                if (e.target.value === '')
                    return getUsers.data
                if (post.username === me.username)
                    return false
                return post.username.toLowerCase().includes(e.target.value.toLowerCase()) 
            })
            setstate({
                query: e.target.value,
                list: results,
            })
        }
    }

    function AddFriendButton(user: any) {
        const [errorBlocked, setErrorBlocked] = useState<any>('')
        const [theBlocked, getBlocked] = useState<any>('')
        const [loadingBlocked, setLoadingBlocked] = useState(true)

        const [sendFriendRequest, setSendFriendRequest] = useState(true)
        const [errorFriendRequest, setErrorFriendRequest] = useState<string>('')

        //only works with 2 because need to change token
        useEffect(() => {
            const config2 = {
                headers: {
                    Authorization: `Bearer ` + `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWQ0MiI6InN0cmluZyIsImlhdCI6MTY4ODQ3OTg0NiwiZXhwIjoxNjg4NTE1ODQ2fQ.tobxckt2ESUp-3iQP7k8JK4WpjEu6oATztHMViQ-v3g`,
                },
            }
            const fetchData = async () => {
                setLoadingBlocked(true)
                await axios
                    .get(`users/` + user.id + `/get_blocked`, config2)
                    .then((response) => {
                        getBlocked(response.data.blocked)
                        setLoadingBlocked(false)
                    })
                    .catch((err) => {
                        console.log(err.message)
                        setErrorBlocked(err.message)
                    })
            }
            fetchData()
        }, [user.id])

        function isBlocked() {
            if (theBlocked) {
                for (let i = 0; i < theBlocked.length; i++) {
                    if (userId === theBlocked[i].id) {
                        return true
                    }
                }
            }
            return false
        }

        function isFriend(toCheck: any) {
            if (getFriends.data) {
                for (let i = 0; i < getFriends.data.length; i++) {
                    if (toCheck === getFriends.data[i].id) {
                        return true
                    }
                }
            }
            return false
        }

        function addFriend() {
            setSendFriendRequest(!sendFriendRequest)
            //blocked only works with user 2 because token du 2
            const [addFriendRequest] = PostAddFriendRequest(user.id)
            setErrorFriendRequest(addFriendRequest.error)
        }

        return (
            <div>
                {/* {!loadingBlocked && errorBlocked && <p>{errorBlocked}</p>} */}
                {!isBlocked() && !isFriend(user.id) && sendFriendRequest && (
                    <button className={btn} onClick={addFriend}>
                        Send friend request/Add friend
                    </button>
                )}
                {errorFriendRequest && <p>{errorFriendRequest}</p>}
                {!sendFriendRequest && !errorFriendRequest && <p>Request sent !</p>}
            </div>
        )
    }

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
                    <button className={btn} onClick={blockUser}>
                        Block user
                    </button>
                )}
                {errorAddBlock && <p>{errorAddBlock}</p>}
                {!Userblocked && !errorAddBlock && <p>User blocked!</p>}
            </div>
        )
    }

    function DmButton(user: any) {
        const navigate = useNavigate()
        const data = {
            name: user.username + '/' + currentUser.data.username,
            access: "DM",
        }
        function startDm() {
            setChannel(PostChannel(data))
            addMember(channel, user.userId)
            navigate(`/chat`)
        }

        return (
            <button className={btn} onClick={startDm}>
                Open DM
            </button>
        )
    }

    function Print() {
        return (
            <div className="mt-2">
                <ul className={ulRow}>
                    {getUsers.loading && <p>Loading ... </p>}
                    {!getUsers.loading && getUsers.error && <p>{getUsers.error}</p>}
                    {!getUsers.loading && !getUsers.error && state.query === ''
                        ? ''
                        : state.list?.map((user: any) => {
                            return (
                                <li className="col card list-group-item m-2 p-2 rounded bg-light" key={user.username}>
                                    <h3 className="card-title">
                                        {user.username}, (id: {user.id})
                                    </h3>
                                    {AddFriendButton(user)}
                                    {BlockUserButton(user)}
                                    {DmButton(user)}
                                </li>
                            )
                        })}
                </ul>
            </div>
        )
    }

    return (
        <div className={card}>
            <div className={row}>
                <form>
                    <label className="form-label h3">
                        <i className="bi bi-search"></i> Who are you looking for:
                    </label>
                    <input placeholder="Type a username here" className="form-control" onChange={handleChange} value={state.query} type="search" />
                </form>
            </div>
            <div className={row}>
                <Print />
            </div>
        </div>
    )
}

export default SearchAddFriends
