import { useState } from 'react'
import axios from 'axios'
import FormData from 'form-data'
import { btn, card } from '../../style/globalCss'
import '../../style/style.css'
import React from "react";

function ChangeAvatar() {
    const [error, setError] = useState<any>('')
    const [loading, setLoading] = useState(true)
    const [selectedFile, setSelectedFile] = useState<any>('')

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append('image', selectedFile)
        try {
            const response = await axios({
                method: 'post',
                url: 'upload',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ` + `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWQ0MiI6InN0cmluZyIsImlhdCI6MTY4NTM3Mzg3MiwiZXhwIjoxNjg1NDA5ODcyfQ.UsyPlujRy6opEbF1UpHqv7eOBDhtdKQ18STqz5Hqc64`,
                },
            })
            setLoading(false)
        } catch (error: any) {
            console.log(error)
            setError(error.message)
        }
    }

    const handleFileSelect = (event: any) => {
        setSelectedFile(event.target.files[0])
    }

    return (
        <div className={card}>
            <form onSubmit={handleSubmit}>
                <label className="form-label">Change your profile pic: </label>
                <input className="form-control" type="file" name="avatar" onChange={handleFileSelect} />
                <input className={btn} type="submit" name="avatar" value="Upload File" />
                {!loading && error && <p>{error}</p>}
                {!loading && !error && <p>file uploaded</p>}
            </form>
        </div>
    )
}
export default ChangeAvatar
