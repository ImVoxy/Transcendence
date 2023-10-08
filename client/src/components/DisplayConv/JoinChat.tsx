import { useState } from 'react'
import React, {useContext} from "react";
import GetChannels from '../../requests/getChannels'
import addMember from '../../requests/addMember'
import { h1, btn } from '../../style/globalCss'
import GetUser from '../../requests/getUser'
import GetOwnChannels from '../../requests/getOwnChannels'
import GetAdminChannels from '../../requests/getAdminChannels'
import GetMemberChannels from '../../requests/getMemberChannels'
import GetBannedChannels from '../../requests/getBannedChannels'
import { UserContext } from '../../context/userContext'


function IsChanAvailable(channels: any, chanId: string) {
    console.log(channels)
    for (let i = 0; channels.data[i]; i++) {
        if (channels.data[i].id === chanId) {
            return (1)
        }
    }
    return 0
}

function IsAlreadyOnChan(chanId: string, ownChannels: any, adminChannels: any, memberChannels: any, bannedChannels: any) {
    for (let i = 0; ownChannels.data.own_channels[i]; i++) {
        if (ownChannels.data.own_channels[i].id === chanId) {
            return 0
        }
    }
    for (let i = 0; adminChannels.data.admin_channels[i]; i++) {
        if (adminChannels.data.admin_channels[i].id === chanId) {
            return 0
        }
    }
    for (let i = 0; memberChannels.data.member_channels[i]; i++) {
        if (memberChannels.data.member_channels[i].id === chanId) {
            return 0
        }
    }
    for (let i = 0; bannedChannels.data.banned_channels[i]; i++) {
        if (bannedChannels.data.banned_channels[i].id === chanId) {
            return 0
        }
    }
    return 1
}

function JoinChat() {
    const me = useContext(UserContext).user;
    const userId: string = me.id
    const [user] = GetUser(userId)
    const [channels] = GetChannels()
    const [chan, setChan] = useState('')
    const [ownChannels] = GetOwnChannels(userId)
    const [adminChannels] = GetAdminChannels(userId)
    const [memberChannels] = GetMemberChannels(userId)
    const [bannedChannels] = GetBannedChannels(userId)

    const joinChan = () => {
        if (chan !== '' && IsChanAvailable(channels, chan) && IsAlreadyOnChan(chan, ownChannels, adminChannels, memberChannels, bannedChannels)) {
            addMember(chan, userId)
        }
    }


    return (
        <div>
            <h1> Join A Chat </h1>
            <label>Channel ID</label>
            <input
                type="text"
                placeholder="Channel ID..."
                onChange={(event) => {
                    setChan(event.target.value)
                }}
            />
            <button className={btn} onClick={joinChan}>
                {' '}
                Join{' '}
            </button>
        </div>
    )
}

export default JoinChat