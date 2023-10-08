import { useState, useEffect } from 'react'
import axios from 'axios'

interface setDataState {
    error: string
    loading: boolean
    data: any
}

const GetBannedChannels = (userId: string) => {
    const [data, setData] = useState<setDataState>({
        error: '',
        loading: true,
        data: {},
	})
	
    useEffect(() => {
        const fetchData = async () => {
            setData({ error: '', loading: true, data: {} })
            await axios
                .get(`/users/` + userId + `/get_banned_channels`, window.config)
				.then((response) => {
                    setData({ error: '', loading: false, data: response.data.banned_channels })
                })
                .catch((err) => {
					console.log(err.message)
                    setData({ error: err.message, loading: false, data: {} })
                })
        }
        fetchData()
	}, [userId])

    return [data]
}

export default GetBannedChannels