import Pong from '../../components/Pong'
import GetUser from '../../requests/getUser'
import { h1, btn, row } from '../../style/globalCss'
import React, {useContext} from "react";
import { UserContext } from '../../context/userContext';


function Home() {
    const me = useContext(UserContext).user;
    return (
        <div className="container-fluid">
            <div className={row}>
                <h1 className={h1}>
                    Welcome {me.username}
                </h1>
            </div>
            <div className={row}>
                <Pong />
                <button className={btn}>Queue up for a game !</button>
            </div>
        </div>
    )
}

export default Home
