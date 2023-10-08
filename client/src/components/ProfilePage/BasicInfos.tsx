import { useState } from 'react'
import { card, row, h1 } from '../../style/globalCss'
import React from "react";

function BasicInfos(user: any) {
    const [image, setImage] = useState<any>('')

    function GetAvatar() {
        if (!image) {
            const fetchImage = async () => {
                const res = await fetch(`/images/` + user.user.avatar)
                const imageBlob = await res.blob()
                const imageObjectURL = URL.createObjectURL(imageBlob)
                setImage(imageObjectURL)
            }
            fetchImage()
        }
    }
    if (!user.user) return null
    return (
        <div className={card}>
            <div className={row}>
                <div className="col d-flex justify-content-end">
                    {!image && <>{GetAvatar()}</>}
                    {!image ? <p>Loading...</p> : <img src={image} className="img-fluid img-thumbnail" alt="my avatar" />}
                </div>
                <div className="col d-flex justify-content-start align-items-center">
                    <h1 className={h1}>{user.user.username}</h1>
                </div>
            </div>
        </div>
    )
}

export default BasicInfos
