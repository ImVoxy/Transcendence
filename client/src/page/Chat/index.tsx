import StartConv from '../../components/StartConv'
import DisplayConv from '../../components/DisplayConv'
import { row } from '../../style/globalCss'
import React from "react";

function Chat() {
    return (
        <div className="container-fluid">
            <div className={row}>
                <StartConv />
            </div>
            <div className={row}>
                <DisplayConv />
            </div>
        </div>
    )
}

export default Chat
