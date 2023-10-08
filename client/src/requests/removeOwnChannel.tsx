import axios from 'axios'

interface setDataState {
    error: string
    loading: boolean
    data: any
}

const RemoveOwnChannel = (userId: string) => {
    let data: setDataState = {
        error: '',
        loading: true,
        data: {},
    }
    const fetchData = async () => {
        data = { error: '', loading: true, data: {} }
        await axios
            .delete(`users/` + userId + `/remove_own_channel`, window.config)
            .then((response) => {
                data = { error: '', loading: false, data: response.data }
            })
            .catch((err) => {
                console.log(err.message)
                data = { error: err.message, loading: false, data: {} }
            })
    }
    fetchData()
    return [data]
}

export default RemoveOwnChannel
