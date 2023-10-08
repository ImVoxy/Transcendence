import { useState, useEffect } from 'react'
import axios from 'axios'

interface setDataState {
    error: string
    loading: boolean
    data: any
}

const GetChannels = () => {
    const [data, setData] = useState<setDataState>({
        error: '',
        loading: true,
        data: {},
    })

    useEffect(() => {
        const fetchData = async () => {
            setData({ error: '', loading: true, data: {} })
            await axios
                .get(`/channels`, window.config)
                .then((response) => {
                    setData({ error: '', loading: false, data: response.data })
                })
                .catch((err) => {
                    console.log(err.message)
                    setData({ error: err.message, loading: false, data: {} })
                })
        }
        fetchData()
    }, [])

    return [data]
}

export default GetChannels
