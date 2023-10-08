import axios from 'axios'

interface setDataState {
    error: string
    loading: boolean
    data: any
}

const PostAddFriendRequest = (userId: string) => { //was object
    let data: setDataState = {
        error: '',
        loading: true,
        data: {},
    }
    const fetchData = async () => {
        data = { error: '', loading: true, data: {} }
        await axios
            .post(
                `/users/` + userId + `/add_friend_request`,
                { withCredentials: true },
                window.config
            )
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

export default PostAddFriendRequest
