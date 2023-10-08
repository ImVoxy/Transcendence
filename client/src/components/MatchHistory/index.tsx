import { useState } from 'react'
import GetGame from '../../requests/getGame'
import { card, row } from '../../style/globalCss'
import React from "react";

function MatchHistory() {
    const [getGame] = GetGame()
    console.log("hello night city")
    console.log(getGame)
    const [maxWon, setMaxWon] = useState<any>(0)
    const [maxLost, setMaxLost] = useState<any>(0)
    const [maxAll, setMaxAll] = useState<any>(0)

    function GetMaxGap(game: any, max: any, type: any) {
        let tmp = 0
        if (game.player_onePoints > game.player_twoPoints) tmp = game.player_onePoints - game.player_twoPoints
        else tmp = game.player_twoPoints - game.player_onePoints
        if (type === 'won' && tmp > maxWon) setMaxWon(tmp)
        else if (type === 'lost' && tmp > maxLost) setMaxLost(tmp)
        else if (type === 'all' && tmp > maxAll) setMaxAll(tmp)
    }

    const youPlayed: any = Object.values(getGame.data).filter((f: any) => f.status === 'ENDED' && (f.player_twoId === 1 || f.player_oneId === 1)).length

    const youOngoing: any = Object.values(getGame.data).filter((f: any) => f.status === 'GOING' && (f.player_twoId === 1 || f.player_oneId === 1)).length

    const youWon: any = Object.values(getGame.data).filter((f: any) => f.status === 'ENDED' && f.winnerId === 1 && (f.player_twoId === 1 || f.player_oneId === 1)).length

    const youLost: any = Object.values(getGame.data).filter((f: any) => f.status === 'ENDED' && f.winnerId !== 1 && (f.player_twoId === 1 || f.player_oneId === 1)).length

    const allPlayed: any = Object.values(getGame.data).filter((f: any) => f.status === 'ENDED').length

    const allGoing: any = Object.values(getGame.data).filter((f: any) => f.status === 'GOING').length

    return (
        <div className={row}>
            <div className={card}>
                <h3 className="card-title border-bottom border-primary pb-1 mb-4">Global statistics</h3>
                {getGame.loading && <p>Loading ... </p>}
                {!getGame.loading && getGame.error && <p>{getGame.error}</p>}
                {!getGame.loading && !getGame.error && (
                    <div className="d-flex flex-wrap ">
                        <p className="m-1 bg-light border rounded p-2">
                            <i className="bi bi-chevron-compact-right text-primary"></i> You played {youPlayed} game
                            {youPlayed > 1 && <span>s</span>} {youPlayed >= 1 && <span>({Math.round((youPlayed * 100) / allPlayed)}% of all ended games played by eveyone)</span>}
                            <i className="bi bi-chevron-compact-left text-primary"></i>
                        </p>
                        <p className="m-1 bg-light border rounded p-2">
                            <i className="bi bi-chevron-compact-right text-primary"></i>
                            You have {youOngoing} ongoing game
                            {youOngoing > 1 && <span>s</span>} {youOngoing >= 1 && <span>({Math.round((youOngoing * 100) / allGoing)}% of all ongoing games played by eveyone)</span>}
                            <i className="bi bi-chevron-compact-left text-primary"></i>
                        </p>
                        <p className="m-1 bg-light border rounded p-2">
                            <i className="bi bi-chevron-compact-right text-primary"></i>
                            You won {youWon} game{youWon > 1 && <span>s</span>} {youWon >= 1 && <span>({Math.round((youWon * 100) / youPlayed)}% of all your played games)</span>}
                            <i className="bi bi-chevron-compact-left text-primary"></i>
                        </p>
                        <p className="m-1 bg-light border rounded p-2">
                            <i className="bi bi-chevron-compact-right text-primary"></i>
                            You lost {youLost} game{youLost > 1 && <span>s</span>} {youLost >= 1 && <span>({Math.round((youLost * 100) / youPlayed)}% of all your played games)</span>}
                            <i className="bi bi-chevron-compact-left text-primary"></i>
                        </p>
                        <p className="m-1 bg-light border rounded p-2">
                            <i className="bi bi-chevron-compact-right text-primary"></i>
                            Considering all players, {allGoing} {allGoing > 1 ? <span>are</span> : <span>is</span>} ongoing <i className="bi bi-chevron-compact-left text-primary"></i>
                        </p>
                        <p className="m-1 bg-light border rounded p-2">
                            <i className="bi bi-chevron-compact-right text-primary"></i>
                            Considering all players, {allPlayed} {allPlayed > 1 ? <span>are</span> : <span>is</span>} ended
                            <i className="bi bi-chevron-compact-left text-primary"></i>
                        </p>
                    </div>
                )}
            </div>
            <div className="container-fluid">
                <div className={row}>
                    <div className="col m-2">
                        <div className={card}>
                            <h3 className="card-title border-bottom border-primary pb-1 mb-4">Games you won: (newest first)</h3>
                            <ul className="list-group">
                                {getGame.loading && <p>Loading ... </p>}
                                {!getGame.loading && getGame.error && <p>{getGame.error}</p>}
                                {!getGame.loading &&
                                    !getGame.error &&
                                    Object.values(getGame.data)
                                        .sort((a: any, b: any) => (a.craetedAt < b.craetedAt ? 1 : -1))
                                        .filter((f: any) => f.status === 'ENDED' && f.winnerId === 1 && (f.player_twoId === 1 || f.player_oneId === 1))
                                        .map((game: any, i) => (
                                            <li className="card list-group-item m-2 p-2 rounded bg-light" key={i}>
                                                <b>Player one:</b> {game.player_one.username} (id: {game.player_oneId})
                                                <br />
                                                <b>Player two:</b> {game.player_two.username} (id: {game.player_twoId})
                                                <br />
                                                <b>Final score: </b>
                                                {game.player_one.username}
                                                &apos;s score : {game.player_onePoints}pts, {game.player_two.username}&apos;s score:
                                                {game.player_twoPoints}
                                                pts
                                                <br />
                                                <b>Started on:</b> {game.craetedAt}
                                                <br />
                                                Mode: {game.mode}
                                                {GetMaxGap(game, maxWon, 'won')}
                                            </li>
                                        ))}
                                <h5 className="card-subtitle">Biggest point gaps in games you won: {maxWon}</h5>
                            </ul>
                        </div>
                    </div>
                    <div className="col m-2">
                        <div className={card}>
                            <h3 className="card-title border-bottom border-primary pb-1 mb-4">Games you lost: (newest first)</h3>
                            <ul className="list-group">
                                {getGame.loading && <p>Loading ... </p>}
                                {!getGame.loading && getGame.error && <p>{getGame.error}</p>}
                                {!getGame.loading &&
                                    !getGame.error &&
                                    Object.values(getGame.data)
                                        .sort((a: any, b: any) => (a.craetedAt < b.craetedAt ? 1 : -1))
                                        .filter((f: any) => f.status === 'ENDED' && f.winnerId !== 1 && (f.player_twoId === 1 || f.player_oneId === 1))
                                        .map((game: any, i) => (
                                            <li className="card list-group-item m-2 p-2 rounded bg-light" key={i}>
                                                <b>Player one: </b>
                                                {game.player_one.username} (id: {game.player_oneId})
                                                <br />
                                                <b>Player two: </b>
                                                {game.player_two.username} (id: {game.player_twoId})
                                                <br />
                                                <b>Final score: </b>
                                                {game.player_one.username}
                                                &apos;s score : {game.player_onePoints}pts, {game.player_two.username}&apos;s score:
                                                {game.player_twoPoints}
                                                pts
                                                <br />
                                                <b>Started on:</b> {game.craetedAt}
                                                <br />
                                                Mode: {game.mode}
                                                {GetMaxGap(game, maxLost, 'lost')}
                                            </li>
                                        ))}
                                <h5 className="card-subtitle">Biggest point gaps in games you lost: {maxLost}</h5>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={row}>
                    <div className="col m-2">
                        <div className={card}>
                            <h3 className="card-title border-bottom border-primary pb-1 mb-4">Ongoing games: (newest first)</h3>
                            <ul className="list-group">
                                {getGame.loading && <p>Loading ... </p>}
                                {!getGame.loading && getGame.error && <p>{getGame.error}</p>}
                                {!getGame.loading &&
                                    !getGame.error &&
                                    Object.values(getGame.data)
                                        .sort((a: any, b: any) => (a.craetedAt < b.craetedAt ? 1 : -1))
                                        .filter((f: any) => f.status === 'GOING' && (f.player_twoId === 1 || f.player_oneId === 1))
                                        .map((game: any, i) => (
                                            <li className="card list-group-item m-2 p-2 rounded bg-light" key={i}>
                                                <b>Player one: </b> {game.player_one.username} (id: {game.player_oneId})
                                                <br />
                                                <b>Player two: </b> {game.player_two.username} (id: {game.player_twoId})
                                                <br />
                                                <b>Current score: </b>
                                                {game.player_one.username}&apos;s score : {game.player_onePoints}pts, {game.player_two.username}&apos;s score:
                                                {game.player_twoPoints}
                                                pts
                                                <br />
                                                <b>Started on: </b> {game.craetedAt}
                                                <br />
                                                Mode: {game.mode}
                                            </li>
                                        ))}
                            </ul>
                        </div>
                    </div>
                    <div className="col m-2">
                        <div className={card}>
                            <h3 className="card-title border-bottom border-primary pb-1 mb-4">All played games by date: (newest first)(maybe add a filter/sort by)</h3>
                            <ul className="list-group">
                                {getGame.loading && <p>Loading ... </p>}
                                {!getGame.loading && getGame.error && <p>{getGame.error}</p>}
                                {!getGame.loading &&
                                    !getGame.error &&
                                    Object.values(getGame.data)
                                        .sort((a: any, b: any) => (a.craetedAt < b.craetedAt ? 1 : -1))
                                        .filter((f: any) => f.status === 'ENDED')
                                        .map((game: any, i) => (
                                            <li className="card list-group-item m-2 p-2 rounded bg-light" key={i}>
                                                <b>Player one: </b>
                                                {game.player_one.username} (id: {game.player_oneId})
                                                <br />
                                                <b>Player two:</b> {game.player_two.username} (id: {game.player_twoId})
                                                <br />
                                                <b>Final score: </b>
                                                {game.player_one.username}
                                                &apos;s score : {game.player_onePoints}pts, {game.player_two.username}&apos;s score:
                                                {game.player_twoPoints}
                                                pts
                                                <br />
                                                <b>Started on:</b> {game.craetedAt}
                                                <br />
                                                Mode: {game.mode}
                                                <br />
                                                Winner : {game.winner.username}
                                                {GetMaxGap(game, maxAll, 'all')}
                                            </li>
                                        ))}
                                <h5 className="card-subtitle">Biggest point gaps in all games: {maxAll}</h5>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MatchHistory
