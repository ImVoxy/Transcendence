import axios from 'axios'

interface setDataState {
    error: string
    loading: boolean
    data: any
}

const PostAddBlocked = (userId: string) => { // was object ????
    let data: setDataState = {
        error: '',
        loading: true,
        data: {},
    }
    const fetchData = async () => {
        data = { error: '', loading: true, data: {} }
        await axios
            .post(
                `/users/` + userId + `/add_blocked`,
                { withCredentials: true },
                window.config
            )
            .then((response) => {
                data = { error: '', loading: false, data: response.data }
            })
            .catch((err) => {
                data = { error: err.message, loading: false, data: {} }
                console.log(err.message)
            })
    }
    fetchData()
    return [data]
}

export default PostAddBlocked
