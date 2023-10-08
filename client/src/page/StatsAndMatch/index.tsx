import MatchHistory from '../../components/MatchHistory'
import { row, h2 } from '../../style/globalCss'
import React from "react";

function StatsAndMatch() {
    return (
        <div className="container-fluid">
            <div className={row}>
                <h2 className={h2}>Stats and history</h2>
            </div>
                <MatchHistory />
        </div>
    )
}

export default StatsAndMatch
