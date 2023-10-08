import { useState, useEffect } from 'react'
import axios from 'axios'

interface setDataState {
    error: string
    loading: boolean
    data: any
}

const GetMessages = (channelId: string) => {
    const [data, setData] = useState<setDataState>({
        error: '',
        loading: true,
        data: {},
	})
	
    useEffect(() => {
        const fetchData = async () => {
            setData({ error: '', loading: true, data: {} })
            await axios
                .get(`channels/` + channelId + `/get_messages`)
				.then((response) => {
                    setData({ error: '', loading: false, data: response.data[0].messages })
                })
                .catch((err) => {
					console.log(err.message)
                    setData({ error: err.message, loading: false, data: {} })
                })
        }
        fetchData()
	}, [channelId])

    return [data]
}

export default GetMessages