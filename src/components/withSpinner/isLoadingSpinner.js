import React from "react";
import {CircularProgress} from "@mui/material";

const LoadingSpinner = () => {
    return <div
        style={{
            width: "100%",
            height:"80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop:"20px"
        }}>
        <CircularProgress color="primary"/>
    </div>
}

export default LoadingSpinner