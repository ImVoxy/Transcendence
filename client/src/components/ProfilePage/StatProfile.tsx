import GetGame from '../../requests/getGame'
import { row, h2, card } from '../../style/globalCss'
import React from "react";

function StatProfile(user: any) {
    const [getGame] = GetGame()

    const othersPlay: any = Object.values(getGame.data).filter((f: any) => f.status === 'ENDED' && (f.player_twoId === user.user.id || f.player_oneId === user.user.id)).length

    const othersOngoing: any = Object.values(getGame.data).filter((f: any) => f.status === 'GOING' && (f.player_twoId === user.user.id || f.player_oneId === user.user.id)).length

    const othersWon: any = Object.values(getGame.data).filter((f: any) => f.status === 'ENDED' && f.winnerId === user.user.id && (f.player_twoId === user.user.id || f.player_oneId === user.user.id)).length

    const othersLost: any = Object.values(getGame.data).filter((f: any) => f.status === 'ENDED' && f.winnerId !== user.user.id && (f.player_twoId === user.user.id || f.player_oneId === user.user.id)).length

    const allPlayed: any = Object.values(getGame.data).filter((f: any) => f.status === 'ENDED').length

    const allGoing: any = Object.values(getGame.data).filter((f: any) => f.status === 'GOING').length

    const oneToOneEnded: any = Object.values(getGame.data).filter((f: any) => f.status === 'ENDED' && (f.player_oneId === user.user.id || f.player_twoId === user.user.id) && (f.player_oneId === 1 || f.player_twoId === 1)).length

    const oneToOneGoing: any = Object.values(getGame.data).filter((f: any) => f.status === 'GOING' && (f.player_oneId === user.user.id || f.player_twoId === user.user.id) && (f.player_oneId === 1 || f.player_twoId === 1)).length

    const youTotalPlayed: any = Object.values(getGame.data).filter((f: any) => f.status === 'ENDED' && (f.player_twoId === 1 || f.player_oneId === 1)).length

    const youTotalonGoing: any = Object.values(getGame.data).filter((f: any) => f.status === 'GOING' && (f.player_twoId === 1 || f.player_oneId === 1)).length

    const LossVSOther: any = Object.values(getGame.data).filter((f: any) => f.status === 'ENDED' && f.winnerId === user.user.id && (f.player_oneId === 1 || f.player_twoId === 1)).length

    const WonVSOther: any = Object.values(getGame.data).filter((f: any) => f.status === 'ENDED' && f.winnerId === 1 && (f.player_oneId === 1 || f.player_twoId === 1)).length

    const youWon: any = Object.values(getGame.data).filter((f: any) => f.status === 'ENDED' && f.winnerId === 1 && (f.player_twoId === 1 || f.player_oneId === 1)).length

    const youLost: any = Object.values(getGame.data).filter((f: any) => f.status === 'ENDED' && f.winnerId !== 1 && (f.player_twoId === 1 || f.player_oneId === 1)).length

    return (
        <div>
            <div className={row}>
                <h2 className={h2}>{user.user.username}&apos;s stats and history</h2>
            </div>
            <div className="container-fluid">
                {getGame.loading && <p>Loading ... </p>}
                {!getGame.loading && getGame.error && <p>{getGame.error}</p>}
                {!getGame.loading && !getGame.error && (
                    <div className={row}>
                        <div className="col-md m-2">
                            <div className={card}>
                                <h3 className="card-title border-bottom border-primary pb-1 mb-4">Global statistics</h3>
                                <div className="d-flex flex-wrap">
                                    <p className="m-1 bg-light border rounded p-2">
                                        <i className="bi bi-chevron-compact-right text-primary"></i>
                                        {user.user.username} played {othersPlay} game
                                        {othersPlay > 1 && <span>s</span>} {othersPlay >= 1 && <span>({Math.round((othersPlay * 100) / allPlayed)}% of all ended games played by eveyone)</span>}
                                        <i className="bi bi-chevron-compact-left text-primary"></i>
                                    </p>
                                    <p className="m-1 bg-light border rounded p-2">
                                        <i className="bi bi-chevron-compact-right text-primary"></i>
                                        {user.user.username} has {othersOngoing} ongoing game{othersOngoing > 1 && <span>s</span>} {othersOngoing >= 1 && <span>({Math.round((othersOngoing * 100) / allGoing)}% of all ongoing games played by eveyone)</span>} <i className="bi bi-chevron-compact-left text-primary"></i>
                                    </p>
                                    <p className="m-1 bg-light border rounded p-2">
                                        <i className="bi bi-chevron-compact-right text-primary"></i>
                                        {user.user.username} won {othersWon} game
                                        {othersWon > 1 && <span>s</span>} {othersWon >= 1 && <span>({Math.round((othersWon * 100) / othersPlay)}% of all his/her played games)</span>}
                                        <i className="bi bi-chevron-compact-left text-primary"></i>
                                    </p>
                                    <p className="m-1 bg-light border rounded p-2">
                                        <i className="bi bi-chevron-compact-right text-primary"></i>
                                        {user.user.username} lost {othersLost} game
                                        {othersLost > 1 && <span>s</span>} {othersLost >= 1 && <span>({Math.round((othersLost * 100) / othersPlay)}% of all his/her played games)</span>}
                                        <i className="bi bi-chevron-compact-left text-primary"></i>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md m-2">
                            <div className={card}>
                                <h3 className="card-title border-bottom border-primary pb-1 mb-4">You vs {user.user.username}:</h3>
                                <div className="d-flex flex-wrap">
                                    <p className="m-1 bg-light border rounded p-2">
                                        <i className="bi bi-chevron-compact-right text-primary"></i>
                                        You played {oneToOneEnded} game
                                        {oneToOneEnded > 1 && <span>s</span>} against {user.user.username} {oneToOneEnded >= 1 && <span>({Math.round((oneToOneEnded * 100) / youTotalPlayed)}% of all your played games)</span>}
                                        <i className="bi bi-chevron-compact-left text-primary"></i>
                                    </p>
                                    <p className="m-1 bg-light border rounded p-2">
                                        <i className="bi bi-chevron-compact-right text-primary"></i>
                                        You have {oneToOneGoing} ongoing game
                                        {oneToOneGoing > 1 && <span>s</span>} against {user.user.username} {oneToOneGoing >= 1 && <span>({Math.round((oneToOneGoing * 100) / youTotalonGoing)}% of all your ongoing games)</span>}
                                        <i className="bi bi-chevron-compact-left text-primary"></i>
                                    </p>
                                    <p className="m-1 bg-light border rounded p-2">
                                        <i className="bi bi-chevron-compact-right text-primary"></i>
                                        You won {WonVSOther} game
                                        {WonVSOther > 1 && <span>s</span>} against {user.user.username} {WonVSOther >= 1 && <span>({Math.round((WonVSOther * 100) / youWon)}% of all your won games)</span>}
                                        <i className="bi bi-chevron-compact-left text-primary"></i>
                                    </p>
                                    <p className="m-1 bg-light border rounded p-2">
                                        <i className="bi bi-chevron-compact-right text-primary"></i>
                                        You lost {LossVSOther} game
                                        {LossVSOther > 1 && <span>s</span>} against {user.user.username} {LossVSOther >= 1 && <span>({Math.round((LossVSOther * 100) / youLost)}% of all your lost games)</span>}
                                        <i className="bi bi-chevron-compact-left text-primary"></i>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StatProfile
