import { useState } from 'react'
import GetUsers from '../../requests/getUsers'
import PatchUsername from '../../requests/patchUsername'
import { btn, card } from '../../style/globalCss'
import '../../style/style.css'
import React from "react";
import { useContext } from "react"
import { UserContext } from '../../context/userContext';

const FieldInput = (props: any) => {
    const { label, errorMessage, type, ...inputProps } = props
    return (
        <div>
            <label className="form-label">{label}</label>
            <input className="form-control" type={type} {...inputProps} />
            <small className="form-text">{errorMessage}</small>
        </div>
    )
}

const inputs = [
    {
        id: 1,
        name: 'username',
        label: 'Change your username: ',
        type: 'text',
        placeholder: 'Enter new username here',
        pattern: '^[A-Za-z0-9]{3,50}$',
        required: true,
        errorMessage: 'Username should be 3 to 50 characters, only alphanumeric characters',
    },
]

function ChangeUsername() {
    const me = useContext(UserContext).user;
    const userId = me.id
    const [getUsers] = GetUsers()
    const [errorPatchUsername, setErrorPatchUsername] = useState<string>('')

    const onSubmit = (event: any) => {
        const newUsername: string = event.target.username.value
        if (getUsers.data) {
            for (let i = 0; i < getUsers.data.length; i++) {
                if (me.username === newUsername) {
                    alert('Username already in use or same as the previous one. Try again.')
                    return
                }
            }
        }
        //Small bug : when we enter a valid username (not in double) then we enter a username already in use we got 500 error. Any other case works well
        event.preventDefault()
        const [patchUsername] = PatchUsername(me.id, newUsername)
        setErrorPatchUsername(patchUsername.error)
    }

    return (
        <div className={card}>
            {getUsers.loading && <p>Loading ... </p>}
            {!getUsers.loading && getUsers.error && <p>{getUsers.error}</p>}
            <form onSubmit={onSubmit}>
                {!getUsers.loading && !getUsers.error && inputs.map((input: any) => <FieldInput key={me.id} {...input} value={input[input.name]} />)}
                <button className={btn} type="submit">
                    Change it!
                </button>
            </form>
        </div>
    )
}

export default ChangeUsername
