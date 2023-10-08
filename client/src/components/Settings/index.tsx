import ChangeUsername from './changeUsername'
import ChangeAvatar from './changeAvatar'
import { h2, row } from '../../style/globalCss'
import React from "react";

function Settings() {
    return (
        <div className='container-fluid'>
            <div className={row}>
                <div className="col-md mb-1">
                    <ChangeUsername />
                </div>
                <div className="col-md mb-1">
                    <ChangeAvatar />
                </div>
            </div>
        </div>
    )
}

export default Settings
