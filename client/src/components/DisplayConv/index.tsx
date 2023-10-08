import { useState, useEffect } from 'react'
import React from "react";
import OneConv from './OneConv'
import GetOwnChannels from '../../requests/getOwnChannels'
import GetAdminChannels from '../../requests/getAdminChannels'
import GetMemberChannels from '../../requests/getMemberChannels'
import GetBannedChannels from '../../requests/getBannedChannels'
import GetChannels from '../../requests/getChannels'
import RemoveOwnChannel from '../../requests/removeOwnChannel'
import RemoveAdminChannel from '../../requests/removeAdminChannel'
import RemoveMemberChannel from '../../requests/removeMemberChannel'
import ChatWidget from '../../components/ChatWidget/ChatWidget'
import io from 'socket.io-client'
import { btn, card } from '../../style/globalCss'
import ScrollToBottom from 'react-scroll-to-bottom'
import { useContext } from "react"
import { UserContext } from '../../context/userContext';
import { SocketContext } from '../../context/socket';

// const socket = io('http://localhost:3000/chat');


function DisplayConv() {
    const [myUsersChannels, setmyUsersChannels] = useState<any>([])
    const [isOpen, setIsOpen] = useState(false)
    const [conv, setParam] = useState<any>('')

    const me = useContext(UserContext).user;
    const userId = me.id
    const [ownChannels] = GetOwnChannels(userId)
    const [adminChannels] = GetAdminChannels(userId)
    const [memberChannels] = GetMemberChannels(userId)
    const [bannedChannels] = GetBannedChannels(userId)
    const [allChannels] = GetChannels()
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [showChat, setShowChat] = useState(false)
    const sockContext = React.useContext(SocketContext);
const socket = sockContext.socketChat

    function JoinRoom(name: any, room: any) {
        if (name !== '' && room !== '') {
            socket.emit('joinRoom', room)
            setShowChat(true)
        }
    }

    function FillArray() {
        for (let i = 0; i < ownChannels.data.own_channels.length; i++) {
            if (!myUsersChannels.some((row: any) => row.includes(ownChannels.data.own_channels[i].id))) {
                myUsersChannels.push([ownChannels.data.own_channels[i].id, ownChannels.data.own_channels[i].name, ownChannels.data.own_channels[i].access])
            }
        }
        for (let i = 0; i < adminChannels.data.admin_channels.length; i++) {
            if (!myUsersChannels.some((row: any) => row.includes(adminChannels.data.admin_channels[i].id))) {
                myUsersChannels.push([adminChannels.data.admin_channels[i].id, adminChannels.data.admin_channels[i].name, adminChannels.data.admin_channels[i].access])
            }
        }
        for (let i = 0; i < memberChannels.data.member_channels.length; i++) {
            if (!myUsersChannels.some((row: any) => row.includes(memberChannels.data.member_channels[i].id))) {
                myUsersChannels.push([memberChannels.data.member_channels[i].id, memberChannels.data.member_channels[i].name, memberChannels.data.member_channels[i].access])
            }
        }
    }

    function LeaveButton(userId: string) {
        const [hasLeft, getHasLeft] = useState(false)
        const [RmFromOwn, setRmFromOwn] = useState<any>('')
        const [RmFromAdmin, setRmFromAdmin] = useState<any>('')
        const [RmFromMember, setRmFromMember] = useState<any>('')

        function LeaveConv() {
            setRmFromOwn(RemoveOwnChannel(userId))
            setRmFromAdmin(RemoveAdminChannel(userId))
            setRmFromMember(RemoveMemberChannel(userId))
            getHasLeft(!hasLeft)
            window.location.reload();
        }

        return (
            <div>
                {!RmFromOwn.loading && RmFromOwn.error && <p>{RmFromOwn.error}</p>}
                {!RmFromAdmin.loading && RmFromAdmin.error && <p>{RmFromAdmin.error}</p>}
                {!RmFromMember.loading && RmFromMember.error && <p>{RmFromMember.error}</p>}
                {!RmFromOwn.loading && !RmFromAdmin.loading && !RmFromMember.loading && !RmFromOwn.error && !RmFromAdmin.error && !RmFromMember.error && !hasLeft && (
                    <button className={btn}
                        onClick={(e) => {
                            e.stopPropagation();
                            LeaveConv();
                        }}>
                        Leave conv
                    </button>
                )}
                {/* {!error && hasLeft && <p>You left the conv !</p>} */}
            </div>
        )
    }

    function LaunchConv() {
        return OneConv(conv)
    }

    function Print() {
        if (!allChannels.data) return null
        if (!ownChannels.data) return null
        if (!adminChannels.data) return null
        if (!memberChannels.data) return null
        if (!bannedChannels.data) return null

        return (
            <div>
                {!isOpen && (
                    <div className={card}>
                        <div>CHANNELS</div>
                        <ul className="list-group">
                            {!ownChannels.loading && !adminChannels.loading && !memberChannels.loading && FillArray()}
                            {/* <p>Print all convs you are in here</p> */}
                            {(ownChannels.loading || adminChannels.loading || memberChannels.loading) && <p>Loading ... </p>}
                            {!ownChannels.loading && ownChannels.error && <p>{ownChannels.error}</p>}
                            {!adminChannels.loading && adminChannels.error && <p>{adminChannels.error}</p>}
                            {!memberChannels.loading && memberChannels.error && <p>{memberChannels.error}</p>}
                            {!ownChannels.loading &&
                                !adminChannels.loading &&
                                !memberChannels.loading &&
                                !ownChannels.error &&
                                !adminChannels.error &&
                                !memberChannels.error &&
                                myUsersChannels.map((conv: any) => {
                                    if (conv[2] !== "DM")
                                        return (
                                            <li
                                                className="card list-group-item m-2 p-2 rounded bg-light"
                                                key={conv}
                                                onClick={() => {
                                                    setName(me.username);
                                                    setRoom(conv[0]);
                                                    setParam(conv);
                                                    setIsOpen(true);
                                                    JoinRoom(me.username, conv[0])
                                                }}
                                            >
                                                <h3 className="card-title">
                                                    <i className="bi bi-chat"></i> {conv[1]} (id {conv[0]})
                                                </h3>
                                                <span>Access: {conv[2]}</span>
                                                <br />
                                                <span>You are: </span>
                                                {ownChannels.data.own_channels.map((convOwn: any) => (
                                                    <span key={convOwn.name}>
                                                        {conv[1] === convOwn.name && !convOwn.password && <span className="bg-success text-white p-1 rounded">Owner</span>}
                                                        {conv[1] === convOwn.name && convOwn.password && <span className="bg-success text-white p-1 rounded"> Owner</span>}
                                                    </span>
                                                ))}
                                                {adminChannels.data.admin_channels.map((convAdmin: any) => (
                                                    <span key={convAdmin.name}>{conv[1] == convAdmin.name && <span className="bg-info text-white p-1 rounded">Admin</span>}</span>
                                                ))}
                                                {memberChannels.data.member_channels.map((convMember: any) => (
                                                    <span key={convMember.name}>{conv[1] == convMember.name && <span className="bg-warning text-white p-1 rounded">Member</span>}</span>
                                                ))}
                                                {/* <br/> */}
                                                {ownChannels.data.own_channels.map((convOwn: any) => (
                                                    <p key={convOwn.name}>
                                                        {conv[1] === convOwn.name && !convOwn.password && <small>No password is set but you can set one by clicking on the conv</small>}
                                                        {conv[1] === convOwn.name && convOwn.password && <small>Pwd management by clinking on the conv</small>}
                                                    </p>
                                                ))}
                                                {bannedChannels.loading && <p>Loading ... </p>}
                                                {!bannedChannels.loading && bannedChannels.error && <p>{bannedChannels.error}</p>}
                                                {!bannedChannels.loading && !bannedChannels.error && bannedChannels.data?.map((convBanned: any) => <p key={convBanned.name}>{conv[1] === convBanned.name && <small className="text-danger">You are banned</small>}</p>)}
                                                {LeaveButton(conv[0])}
                                            </li>
                                        )
                                })}
                        </ul>
                        <div>DM</div>
                        <ul className="list-group">
                            {
                                myUsersChannels.map((conv: any) => {
                                    if (conv[2] === "DM")
                                        return (
                                            <li
                                                className="card list-group-item m-2 p-2 rounded bg-light"
                                                key={conv}
                                                onClick={() => {
                                                    setName(me.username);
                                                    setRoom(conv[0]);
                                                    setParam(conv);
                                                    setIsOpen(true);
                                                    JoinRoom(me.username, conv[0])
                                                }}
                                            >
                                                <h3 className="card-title">
                                                    <i className="bi bi-chat"></i> {conv[1]}
                                                </h3>
                                                {/* {LeaveButton(conv[0])} */}
                                            </li>)
                                })}
                        </ul>
                    </div>
                )}
                {isOpen && (
                    <div className={card}>
                        <span>
                            <LaunchConv />
                            <ChatWidget socket={socket} username={name} room={conv[0]} />
                            <button className={btn} onClick={() => setIsOpen(false)}>
                                Close channel
                            </button>
                        </span>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div>
            <Print />
        </div>
    )
}

export default DisplayConv
