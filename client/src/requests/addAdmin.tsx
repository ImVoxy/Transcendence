import axios from 'axios'

interface setDataState {
    error: string
    loading: boolean
    data: any
}

const AddAdmin = (channelId: number, userId: string) => {
    let data: setDataState = {
        error: '',
        loading: true,
        data: {},
    }

    const fetchData = async () => {
        data = { error: '', loading: true, data: {} }
        await axios
            .post(`channels/` + channelId + `/add_admin`, { adminId: userId })
            .then((response) => {
                data = { error: '', loading: false, data: response.data }
                alert('Admin added')
                window.location.reload()
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

export default AddAdmin
