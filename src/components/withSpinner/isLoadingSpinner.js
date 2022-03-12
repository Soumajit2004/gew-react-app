import React from "react";
import {CircularProgress} from "@mui/material";

const LoadingSpinner = () => {
    return <div
        style={{
            width: "100%",
            height:"100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
        <CircularProgress color="primary" size={50}/>
    </div>
}

export default LoadingSpinner