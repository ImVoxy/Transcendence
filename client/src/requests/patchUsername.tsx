import axios from 'axios'

interface setDataState {
    error: string
    loading: boolean
    data: any
}

const PatchUsername = (userId: string, newUsername: string) => {
    let data: setDataState = {
        error: '',
        loading: true,
        data: {},
    }
    const fetchData = async () => {
        data = { error: '', loading: true, data: {} }
        await axios
            .patch(`/users/` + userId, { username: newUsername })
            .then((response) => {
                data = { error: '', loading: false, data: response.data }
                alert('Username changed')
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

export default PatchUsername
