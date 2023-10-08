import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import StatProfile from './StatProfile'
import BasicInfos from './BasicInfos'
import { row } from '../../style/globalCss'
import React from "react";

function ProfilePage() {
    const [error, setError] = useState<any>('')
    const [loading, setLoading] = useState(true)
    const [oneProfile, getOneProfile] = useState<any>('')
    const { username } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            await axios
                .get(`/users/`)
                .then((response) => {
                    const result = response.data.filter((data: any) => {
                        return data.username === username
                    })
                    getOneProfile(result[0])
                    setLoading(false)
                })
                .catch((err) => {
                    console.log(err.message)
                    setError(err.message)
                })
        }
        fetchData()
    }, [username])

    return (
        <div className="container-fluid">
            <div className={row}>
                {loading && <p>Loading ... </p>}
                {!loading && error && <p>{error}</p>}
                <BasicInfos user={oneProfile} />
            </div>
            <div className={row}>
                <StatProfile user={oneProfile} />
            </div>
        </div>
    )
}

export default ProfilePage
