import SearchAddFriends from '../../components/SearchAddFriends/index'
import AllFriends from '../../components/AllFriends'
import ReceivedFriendRequests from '../../components/ReceivedFriendRequests'
import SentFriendRequests from '../../components/SentFriendRequests'
import BlockedFriends from '../../components/BlockedFriends'
import { h1, h2, card, row } from '../../style/globalCss'
import React from "react";

function Friends() {
    return (
        <div className="container-fluid">
            <div className={row}>
                <b className={h2}>Friendlist</b>
            </div>
            <div className={row}>
                <SearchAddFriends />
            </div>
            <div className={row}>
                <div className="col-md">
                    <div className={card}>
                        <h3 className="card-title border-bottom border-primary pb-1 mb-4">Your friend requests:</h3>
                        <ReceivedFriendRequests />
                        <SentFriendRequests />
                    </div>
                </div>
                <div className="col-md">
                    <div className={card}>
                        <h3 className="card-title border-bottom border-primary pb-1 mb-4"> All friends:</h3>
                        <AllFriends />
                    </div>
                </div>

                <div className="col-md">
                    <div className={card}>
                        <h3 className="card-title border-bottom border-primary pb-1 mb-4">Blocked people</h3>
                        <BlockedFriends />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Friends
