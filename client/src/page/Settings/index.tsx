import Settings from '../../components/Settings'
import { useState } from 'react'
import GetUser from '../../requests/getUser'
import { h1, h2, card, row } from '../../style/globalCss'
import React from "react";
import { useContext } from "react"
import { UserContext } from '../../context/userContext';
import GetUsers from '../../requests/getUsers'

function UsersSettings() {
    const [image, setImage] = useState<any>('')
    const me = useContext(UserContext).user;
    const [getUsers] = GetUsers()

    function getImage() {
        const fetchImage = async () => {
            if (1) {
                const res = await fetch(`/images/` + me.avatar)
                const imageBlob = await res.blob()
                const imageObjectURL = URL.createObjectURL(imageBlob)
                setImage(imageObjectURL)
                console.log("getUsers")
                console.log(getUsers)
            }
        }
        if (1) fetchImage()
    }
    if (!me) return null
    return (
        <div className="container-fluid">
            <div className={row}>
                <div className={card}>
                    <div className={row}>
                        <div className="col d-flex justify-content-end">
                            {!image && <>{getImage()}</>}
                            {!image ? <p>Loading...</p> : <img src={image} className="img-fluid img-thumbnail" alt="my avatar" />}
                        </div>
                        <div className="col d-flex justify-content-start align-items-center">{<h1 className={h1}>{me.username}</h1>}</div>
                    </div>
                </div>
            </div>
            <div className={row}>
                <h2 className={h2}>A few settings:</h2>
            </div>
            <div className={row}>
                <Settings />
            </div>
        </div>
    )
}

export default UsersSettings
