import { useState } from 'react'
import PostChannel from '../../requests/postChannels'
import { btn, card, row } from '../../style/globalCss'
import GetChannels from '../../requests/getChannels'
import GetChannel from '../../requests/getChannel'
import addMember from '../../requests/addMember'
import GetUser from '../../requests/getUser'
import GetOwnChannels from '../../requests/getOwnChannels'
import GetAdminChannels from '../../requests/getAdminChannels'
import GetMemberChannels from '../../requests/getMemberChannels'
import GetBannedChannels from '../../requests/getBannedChannels'
import { getChannel } from 'stream-chat-react'
import io from 'socket.io-client'
import { createJsxAttribute } from 'typescript'
import React from "react";
import { useContext } from "react"
import { UserContext } from '../../context/userContext';
import { cp } from 'fs'
import { setDefaultResultOrder } from 'dns'

function IsNameAvailable(name: any, channels: any) {
    for (let i = 0; channels.data[i]; i++) {
        if (channels.data[i].name === name) {
            return (0)
        }
    }
    return (1)
}

function isPwdCorrect(channels: any, pwd: any, id: any) {
    console.log(channels[0])
    for (let i = 0; channels[i]; i++){
        if (channels[i].id === id)
        {
            if (pwd === channels[i].password || (pwd === '' && !channels[i].password))
            {
                return (true)
            }
                else{
                alert('Password is invalid')
                return (false)
            }
        }
    }
    // console.log(id)
    // console.log(pwd)
    // console.log(channels.data[id - 1].password)
    alert('Password is invalid')
    return (false)
}


function IsChanAvailable(channels: any, chanId: any) {
    for (let i = 0; channels.data[i]; i++) {
        // console.log(channels.data[i].id)
        // console.log(chanId)
        if (channels.data[i].id === chanId) {
            return (1)
        }
    }
    alert('This ID is not assigned');
    return 0
}

function IsAlreadyOnChan(chanId: any, ownChannels: any, adminChannels: any, memberChannels: any, bannedChannels: any) {
    for (let i = 0; ownChannels.data.own_channels[i]; i++) {
        if (ownChannels.data.own_channels[i].id === chanId) {
            alert('You are already registered to this channel');
            return 0
        }
    }
    for (let i = 0; adminChannels.data.admin_channels[i]; i++) {
        if (adminChannels.data.admin_channels[i].id === chanId) {
            alert('You are already registered to this channel');
            return 0
        }
    }
    for (let i = 0; memberChannels.data.member_channels[i]; i++) {
        if (memberChannels.data.member_channels[i].id === chanId) {
            alert('You are already registered to this channel');
            return 0
        }
    }
    if (bannedChannels.data[0])
        for (let i = 0; bannedChannels.data.banned_channels[i]; i++) {
            if (bannedChannels.data.banned_channels[i].id === chanId) {
                alert('You are banned from this channel');
                return 0
            }
        }
    return 1
}

function StartConv() {
    const me = useContext(UserContext).user;
    const userId = me.id
    // const [user] = GetUser(userId)
    const [displayAllChannels, setDisplay] = useState(true)
    const [chan, setChan] = useState('')
    const [ownChannels] = GetOwnChannels(userId)
    const [adminChannels] = GetAdminChannels(userId)
    const [memberChannels] = GetMemberChannels(userId)
    const [bannedChannels] = GetBannedChannels(userId)
    const [channels] = GetChannels()
    const [NewConv, isNewConvOn] = useState(true)
    const [JoinConv, isJoinOn] = useState(true)
    const [accessType, setUserChoice] = useState('')
    const [Pwd, pwd] = useState<string>('')
    const [ConfirmPwd, confirmPwd] = useState<string>('')
    const [channel, setChannel] = useState<any>('')
    const [nameOk, setName] = useState('')

    console.log("test")
    console.log(channels)

    const CreationInput = () => {
        return (
            <div className="container-fluid">
                <div className={row}>
                    <div className="form-group mb-3 col">
                        <label className="form-label">
                            <b>Enter a topic/name for your conv: </b>
                        </label>
                        <input className="form-control" type="text" name="topic" placeholder="Enter topic/name here" pattern="^[A-Za-z0-9]{3,50}$" required />
                        <small>{'Topic/name should be 3 to 50 characters, only alphanumeric characters'}</small>
                    </div>
                    <div className="form-group mb-3 col">
                        <label className="form-label" htmlFor="access_type">
                            <b>Chose the level of access: </b>
                        </label>
                        <br />
                        <select name="access" id="access_type" onChange={(e) => setUserChoice(e.target.value)} required>
                            <option value="">--Please choose an option--</option>
                            <option value="PUBLIC">PUBLIC</option>
                            <option value="PRIVATE">PRIVATE</option>
                            <option value="PROTECTED">PROTECTED</option>
                        </select>
                        <br />
                        <small>{'Choose bewteen public, protected (with a password) or private (on invite'}</small>
                    </div>
                </div>
                {accessType === 'PROTECTED' && (
                    <div className={row}>
                        <div className="form-group mb-3 col">
                            <label className="form-label" htmlFor="convPass">
                                <b>Password:</b>
                            </label>
                            <input className="form-control" type="password" id="convPass" name="convPass" placeholder="Enter the conversation's password here" pattern="^(?=.*[!@#$%^&*()_+\-=[\]{};':&quot;\\|,.<>/?])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).[^\s]{8,}$" onChange={(e) => pwd(e.target.value)} required />
                            <small>{'minimum 8 char, 1 special char, 1 lower case, 1 uppercase, 1 digit, no space'}</small>
                        </div>
                        <div className="form-group mb-3 col">
                            <label className="form-label" htmlFor="confirmPwd">
                                <b>Please confirm password :</b>
                            </label>
                            <br />
                            {/* <label className="form-label" htmlFor="confirmPwd">
                                Password (8 characters minimum):
                            </label> */}
                            <input type="password" id="confirmPwd" name="confirmPwd" placeholder="Confirm the conversation's password here" pattern="^(?=.*[!@#$%^&*()_+\-=[\]{};':&quot;\\|,.<>/?])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).[^\s]{8,}$" onChange={(e) => confirmPwd(e.target.value)} required />
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const JoinInput = () => {
        return (
            <div className="container-fluid">
                <div className={row}>
                    <div className="form-group mb-3 col">
                        <label className="form-label">
                            <b>Enter ID of a chan: </b>
                        </label>
                        <input className="form-control" type="string" name="id" placeholder="Enter ID" onChange={(e) => { setChan(e.target.value) }} required />
                    </div>
                    <div className="form-group mb-3 col">
                    </div>
                </div>
                <div className={row}>
                    <div className="form-group mb-3 col">
                        <label className="form-label" htmlFor="convPass">
                            <b>Password:</b>
                        </label>
                        <input className="form-control" type="password" id="convPass" name="convPass" placeholder="Enter the channel's password here" onChange={(e) => pwd(e.target.value)} />
                        <small>{'let this field empty if channel requier no password'}</small>
                    </div>
                    <div className="form-group mb-3 col">
                    </div>
                </div>
                {/* {accessType === 'Protected' && ( */}
                {/* <div className={row}>
                    <div className="form-group mb-3 col">
                        <label className="form-label" htmlFor="convPass">
                            <b>Password:</b>
                        </label>
                        <input className="form-control" type="password" id="convPass" name="convPass" placeholder="Enter the conversation's password here" pattern="^(?=.*[!@#$%^&*()_+\-=[\]{};':&quot;\\|,.<>/?])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).[^\s]{8,}$" onChange={(e) => pwd(e.target.value)} required />
                    </div>
                </div> */}
                {/* )} */}
            </div>

        )
    }
    const ChanOutput = () => {
        const test = [];
        let j = 0;
        for (let i = 0; channels.data[i]; i++) {
            if (channels.data[i] && channels.data[i].access != "PRIVATE" && channels.data[i].access != "DM") {
                test[j] = {name: <div>➜ <b>{channels.data[i].name}</b> (id: {channels.data[i].id})</div>}
                j++
            }
        }
        return (test.map(data => 
            <div key={1}>
                {data.name}
             </div>))
    }

    const joinChan = (event: any) => {
        event.preventDefault()
        if (chan !== '' && IsChanAvailable(channels, chan) && isPwdCorrect(channels.data, Pwd, chan) && IsAlreadyOnChan(chan, ownChannels, adminChannels, memberChannels, bannedChannels)) {
            addMember(chan, userId)      
            // window.location.reload();
        }
    }

    const onSubmit = (event: any) => {
        event.preventDefault()
        let data: object
        if (IsNameAvailable(event.target.topic.value, channels)) {
            if (event.target.access.value === 'PROTECTED') {
                data = {
                    name: event.target.topic.value,
                    access: event.target.access.value,
                    password: event.target.convPass.value,
                }
            } else {
                data = {
                    name: event.target.topic.value,
                    access: event.target.access.value,
                }
            }
            setChannel(PostChannel(data))
            window.location.reload();
        }
        else
            alert('This name is already taken');
    }

    return (
        <div className={card}>
            <div className="d-flex align-self-center">
                {channel.loading && <p>Loading ... </p>}
                {!channel.loading && channel.error && <p>{channel.error}</p>}
                {NewConv && JoinConv && displayAllChannels && (
                    <div className=" row d-flex flex-wrap border-bottom border-primary pb-1 mb-4">
                        <div className="col">
                            {1 && (
                                <button className={btn} onClick={() => isJoinOn(false)}>
                                    Join an existing chat
                                </button>
                            )}
                        </div>
                        <div className="col">
                            {1 && (
                                <button className={btn} onClick={() => isNewConvOn(false)}>
                                    <p>Create a new chat</p>
                                </button>
                            )}
                        </div>
                        <div className="col">
                            {1 && (
                                <button className={btn} onClick={() => setDisplay(false)}>
                                    <p>Show all Channels</p>
                                </button>
                            )}
                        </div>
                    </div>
                )}
                {!NewConv && (
                    <button onClick={() => isNewConvOn(true)} type="button" className={btn} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                )}
                {!JoinConv && (
                    <button onClick={() => isJoinOn(true)} type="button" className={btn} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                )}
                {!displayAllChannels && (
                    <button onClick={() => setDisplay(true)} type="button" className={btn} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                )}
            </div>
            <div>
                {!NewConv && (
                    <form onSubmit={onSubmit}>
                        {!channel.loading && !channel.error && CreationInput()}
                        {Pwd !== ConfirmPwd && <p className="text-danger">{'Passwords are not the same'}</p>}
                        {Pwd === ConfirmPwd && (
                            <button className={btn} type="submit">
                                Create the conv
                            </button>
                        )}
                    </form>
                )}
                {!JoinConv && (
                    <form onSubmit={joinChan}>
                        {!channel.loading && !channel.error && JoinInput()}
                        {(
                            <button className={btn} type="submit">
                                Join the conv
                            </button>
                        )}
                    </form>
                )}
                {!displayAllChannels && (
                    <form>
                        {!channel.loading && !channel.error && ChanOutput()}
                    </form>
                )}
            </div>
        </div>
    )
}

export default StartConv
