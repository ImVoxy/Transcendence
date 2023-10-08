import React from "react";
import { Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";



export default function SchoolLogin() {
    const login = () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        window.location.href = process.env.REACT_APP_FORTYTWO_REDIRECT_URL!;
    };

    return (
    <div style={{ marginTop: "10px" }}>
        <Button
            onClick={login}
            fullWidth
            variant="contained"
            startIcon={<LoginIcon />}
        >
            School Login
        </Button>
    </div>
    );

}
