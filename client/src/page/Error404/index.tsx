import NotFound from '../../components/Error404'
import React from "react";

function Error404() {
    return (
        <div className="h-100 w-100 d-flex justify-content-center">
            <NotFound />
        </div>
    )
}

export default Error404
