import axios from 'axios'

interface setDataState {
    error: string
    loading: boolean
    data: any
}

const AddMember = (channelId: string, userId: string) => {
    let data: setDataState = {
        error: '',
        loading: true,
        data: {},
    }

    const fetchData = async () => {
        // console.log("HELLO NC")
        // console.log(`/channels/` + channelId + `/add_member`, { userId })
        data = { error: '', loading: true, data: {} }
        await axios
            .post(`/channels/` + channelId + `/add_member`, { memberId: userId })
            .then((response) => {
                data = { error: '', loading: false, data: response.data }
                alert('member added')
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

export default AddMember