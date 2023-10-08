import React from "react";
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import BasicInfos from './BasicInfos'

function ConvPage() {
    console.log('salut')
    return (
        <div>
            <p>coucou</p>
            {/* <BasicInfos user={convname} /> */}
            {/* <StatProfile user={oneProfile} /> */}
        </div>
    )
}

export default ConvPage
