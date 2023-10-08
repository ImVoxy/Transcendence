import { useState, useEffect } from 'react'
import axios from 'axios'

interface setDataState {
    error: string
    loading: boolean
    data: any
}

const GetUsersFilter = (username: string) => {
    const [data, setData] = useState<setDataState>({
        error: '',
        loading: true,
        data: {},
    })

    useEffect(() => {
        const fetchData = async () => {
            setData({ error: '', loading: true, data: {} })
            await axios
                .get(`/users/`)
                .then((response) => {
                    const result = response.data.filter((data: any) => {
                        return data.username === username
                    })
                    setData({ error: '', loading: false, data: result[0] })
                })
                .catch((err) => {
                    console.log(err.message)
                    setData({ error: err.message, loading: false, data: {} })
                })
        }
        fetchData()
    }, [username])

    return [data]
}

export default GetUsersFilter
