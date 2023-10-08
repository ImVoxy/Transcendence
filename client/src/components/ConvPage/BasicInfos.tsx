import React from "react";
import { useState } from 'react'

function BasicInfos(user: any) {
    const [image, setImage] = useState<any>('')

    function getImage() {
        if (!image) {
            const url = `/images/` + user.user.avatar
            const fetchImage = async () => {
                const res = await fetch(url)
                const imageBlob = await res.blob()
                const imageObjectURL = URL.createObjectURL(imageBlob)
                setImage(imageObjectURL)
            }
            fetchImage()
        }
    }

    if (!user.user) return null
    if (!user.user.avatar) return null
    return (
        <div>
            <div>
                <p>{user.user.username}'s profile</p>
                {!image && <>{getImage()}</>}
                {!image ? (
                    <p>Loading</p>
                ) : (
                    <img
                        src={image}
                        style={{ width: 50, height: 60 }}
                        alt="user's avatar"
                    />
                )}
                <p>member since {user.user.createdAt}</p>
            </div>
        </div>
    )
}

export default BasicInfos
