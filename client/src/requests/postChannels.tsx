import axios from 'axios'

interface setDataState {
    error: string
    loading: boolean
    data: any
}

const PostChannel = (params: object) => {
    let data: setDataState = {
        error: '',
        loading: true,
        data: {},
    }
    const fetchData = async () => {
        data = { error: '', loading: true, data: {} }
        await axios
            .post(`/channels/`, params, window.config)
            .then((response) => {
                data = { error: '', loading: false, data: response.data }
                alert('created')
            })
            .catch((err) => {
                console.log(err.message)
                alert('Error: ' + err.message)
                data = { error: err.message, loading: false, data: {} }
            })
    }
    fetchData()
    return [data]
}

export default PostChannel
