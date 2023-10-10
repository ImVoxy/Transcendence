import { useState, useEffect } from 'react'
import React from "react";
import GetChannel from '../../requests/getChannel'
import GetAdmins from '../../requests/getAdmins'
import GetMembers from '../../requests/getMembers'
import RemoveAdmin from '../../requests/removeAdmin'
import RemoveMember from '../../requests/removeMember'
import AddBanned from '../../requests/addBanned'
import AddAdmin from '../../requests/addAdmin'
import PatchPassword from '../../requests/patchPasswordChannel'
import GetMessages from '../../requests/getMessages'
import GetUsers from '../../requests/getUsers'
import GetBlocked from '../../requests/getBlocked'
import { row, btn, btnBlock, card } from '../../style/globalCss'
import { UserContext } from '../../context/userContext';
import { useContext } from "react"

function OneConv(conv: any) {
    const me = useContext(UserContext).user;
    const userId = me.id
    const [Pwd, pwd] = useState<any>('')
    const [ConfirmPwd, confirmPwd] = useState<any>('')
    const [pwdSettings, isPwdSettingsOn] = useState(false)
    const [displayEveryone, isDisplayEveryoneOn] = useState(false)
    const [channel] = GetChannel(conv[0])
    const [getAdmins] = GetAdmins(conv[0])
    const [getMembers] = GetMembers(conv[0])
    const [getMessages] = GetMessages(conv[0])
    const [getBlocked] = GetBlocked(userId)
    const [getUsers] = GetUsers()
    const blockFilters = getBlocked.data.blocked?.map((request: any) => request.id)

    const ChangePwd = (event: any) => {
        event.preventDefault()
        const data = {
            access: 'PROTECTED',
            password: event.target.convPass.value,
        }
        const [changePwd] = PatchPassword(conv[0], data)
    }

    function DeletePwd() {
        const data = {
            access: 'PUBLIC',
            password: null,
        }
        const [changePwd] = PatchPassword(conv[0], data)
    }

    function ButtonRemoveAdmin(user: any, channel: any) {
        const [RmAdmin] = RemoveAdmin(channel, user)
    }

    function ButtonAddAdmin(user: any, channel: any) {
        const [addAdmin] = AddAdmin(channel, user)
    }

    function KickUser(user: any, channel: any) {
        const [RmAdmin] = RemoveAdmin(channel, user)
        const [RmMember] = RemoveMember(channel, user)
    }

    function BanUser(user: any, channel: any) {
        KickUser(user, channel)
        const [BanMember] = AddBanned(channel, user)
    }

    const FieldInput = () => {
        return (
            <div>
                <div className={row}>
                    <div className="form-group mb-3 col">
                        <label className="form-label" htmlFor="convPass">
                            <b>New password:</b>
                        </label>
                        <input className="form-control" type="password" id="convPass" name="convPass" placeholder="Enter the conversation's password here" pattern="^(?=.*[!@#$%^&*()_+\-=[\]{};':&quot;\\|,.<>/?])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).[^\s]{8,}$" onChange={(e) => pwd(e.target.value)} required />
                        <small>{'minimum 8 char, 1 special char, 1 lower case, 1 uppercase, 1 digit, no space'}</small>
                    </div>
                    <div className="form-group mb-3 col">
                        <label className="form-label" htmlFor="confirmPwd">
                            <b>Please confirm password :</b>
                        </label>
                        <input className="form-control" type="password" id="confirmPwd" name="confirmPwd" placeholder="Confirm the conversation's password here" pattern="^(?=.*[!@#$%^&*()_+\-=[\]{};':&quot;\\|,.<>/?])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).[^\s]{8,}$" onChange={(e) => confirmPwd(e.target.value)} required />
                    </div>
                </div>
            </div>
        )
    }

    function FindUsername(toFind: any) {
        if (!getUsers.loading && !getUsers.error)
            for (let i = 0; i < getUsers.data.length; i++) {
                if (toFind === getUsers.data[i].id) {
                    return getUsers.data[i].username
                }
            }
        return (false)
    }

    function isAdmin(user: any) {
        if (getAdmins.data) {
            for (let i = 0; i < getAdmins.data.admins.length; i++) {
                if (user === getAdmins.data.admins[i].id) {
                    return true
                }
            }
        }
        return false
    }

    function isMember(user: any) {
        if (getMembers.data) {
            for (let i = 0; i < getMembers.data.members.length; i++) {
                if (user === getMembers.data.members[i].id) {
                    return true
                }
            }
        }
        return false
    }

    return (
        <div>
            <div className=" row d-flex flex-wrap border-bottom border-primary pb-1 mb-4">
                <div className="col">
                    <h3 className="card-title">{conv[1]}</h3>
                </div>
                <div className="col">
                    {!displayEveryone && (
                        <button className={btn} onClick={() => isDisplayEveryoneOn(true)}>
                            See all participants
                        </button>
                    )}
                </div>
                <div className="col">
                    {!pwdSettings && conv[2] !== "DM" && (
                        <button className={btn} onClick={() => { isAdmin(userId) && isPwdSettingsOn(true) }} >
                            Pwd management
                        </button>
                    )}
                </div>
            </div>
            {
                displayEveryone && (
                    <div>
                        {channel.loading && <p>Loading ... </p>}
                        {!channel.loading && channel.error && <p>{channel.error}</p>}
                        {!channel.loading && !channel.error && channel.data.ownerId && (
                            <li className="card list-group-item m-2 p-2 rounded bg-light">
                                <i className="bi bi-person-circle"> </i>
                                {channel.data.ownerId && FindUsername(channel.data.ownerId)} <span className="bg-success text-white p-1 rounded">Owner</span>
                                {isAdmin(channel.data.ownerId) && <span className="bg-info text-white p-1 rounded">Admin</span>}
                                {isMember(channel.data.ownerId) && <span className="bg-warning text-white p-1 rounded">Member</span>}
                            </li>
                        )}
                        {getAdmins.loading && <p>Loading ... </p>}
                        {!getAdmins.loading && getAdmins.error && <p>{getAdmins.error}</p>}
                        {!getAdmins.loading &&
                            !getAdmins.error &&
                            getAdmins.data.admins?.map(
                                (request: any) =>
                                    channel.data.ownerId !== request.id && (
                                        <li className="card list-group-item m-2 p-2 rounded bg-light" key={request.id}>
                                            <div className={row}>
                                                <div className="col">
                                                    <i className="bi bi-person-circle"> </i> {request.username}
                                                    <span className="bg-info text-white p-1 rounded">Admin</span>
                                                    {isMember(request.id) && <span className="bg-warning text-white p-1 rounded">Member</span>}
                                                </div>
                                                <div className="col">
                                                    {channel.data.ownerId === 1 && (
                                                        <button className={btn} onClick={() => ButtonRemoveAdmin(request.id, channel.data.id)}>
                                                            Remove from admin
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="col">
                                                    {isAdmin(1) && channel.data.ownerId !== request.id && (
                                                        <button className={btn} onClick={() => KickUser(request.id, channel.data.id)}>
                                                            Kick user
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="col">
                                                    {isAdmin(1) && channel.data.ownerId !== request.id && (
                                                        <button className={btnBlock} onClick={() => BanUser(request.id, channel.data.id)}>
                                                            Ban user
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    )
                            )}

                        {getMembers.loading && <p>Loading ... </p>}
                        {!getMembers.loading && getMembers.error && <p>{getMembers.error}</p>}
                        {!getMembers.loading &&
                            !getMembers.error &&
                            getMembers.data.members?.map(
                                (request: any) =>
                                    channel.data.ownerId !== request.id &&
                                    !isAdmin(request.id) && (
                                        <li className="card list-group-item m-2 p-2 rounded bg-light" key={request.id}>
                                            <div className={row}>
                                                <div className="col">
                                                    <i className="bi bi-person-circle"> </i> {request.username} <span className="bg-warning text-white p-1 rounded">Member</span>
                                                    {isAdmin(request.id) && <span className="bg-info text-white p-1 rounded">Admin</span>}
                                                </div>
                                                <div className="col">
                                                    {channel.data.ownerId === 1 && !isAdmin(request.id) && (
                                                        <button className={btn} onClick={() => ButtonAddAdmin(request.id, channel.data.id)}>
                                                            Add as admin
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="col">
                                                    {isAdmin(1) && channel.data.ownerId !== request.id && (
                                                        <button className={btn} onClick={() => KickUser(request.id, channel.data.id)}>
                                                            Kick user
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="col">
                                                    {isAdmin(1) && channel.data.ownerId !== request.id && (
                                                        <button className={btnBlock} onClick={() => BanUser(request.id, channel.data.id)}>
                                                            Ban user
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    )
                            )}

                        <button className={btn} onClick={() => isDisplayEveryoneOn(false)}>
                            Close <i className="bi bi-x"></i>
                        </button>
                    </div>
                )
            }

            {
                pwdSettings && (
                    <div className={card}>
                        <form onSubmit={ChangePwd}>
                            {FieldInput()}
                            {Pwd === ConfirmPwd && (
                                <button className={btn} type="submit">
                                    Change/add the pwd
                                </button>
                            )}
                            {Pwd !== ConfirmPwd && <p className="text-danger">Passwords are not the same</p>}
                        </form>
                        <button className={btn} onClick={DeletePwd}>
                            Delete password
                        </button>
                        <button className={btn} onClick={() => isPwdSettingsOn(false)}>
                            Close <i className="bi bi-x"></i>
                        </button>
                    </div>
                )
            }
            <ul className="list-group">
                {getMessages.loading && getBlocked.loading && <p>Loading ... </p>}
                {getMessages.error && <p>{getMessages.error}</p>}
                {getBlocked.error && <p>{getBlocked.error}</p>}
                {!getMessages.loading &&
                    !getBlocked.loading &&
                    !getMessages.error &&
                    !getBlocked.error &&
                    getMessages.data
                        .filter((request: any) => {
                            if (blockFilters) {
                                for (let i = 0; i <= blockFilters.length; i++) {
                                    if (blockFilters[i] === request.authorId) {
                                        return
                                    }
                                }
                                return request.authorId
                            }
                        })
                        ?.map((request: any) => (
                            <li className="card list-group-item m-2 p-2 rounded bg-light" key={request.id}>
                                {request.authorId === userId && (
                                    <div>
                                        <p className="d-flex justify-content-end m-1">
                                            <b>
                                                {FindUsername(request.authorId)} (send by {request.authorId}) :
                                            </b>
                                            {request.text}
                                        </p>
                                        <small className="d-flex justify-content-end">{request.createdAt}</small>
                                    </div>
                                )}
                                {request.authorId !== userId && (
                                    <div>
                                        <p className="m-1">
                                            <b>
                                                {FindUsername(request.authorId)} (send by {request.authorId}) :
                                            </b>
                                            {request.text}
                                        </p>
                                        <small>{request.createdAt}</small>
                                    </div>
                                )}
                            </li>
                        ))}
            </ul>
        </div >
    )
}

export default OneConv
