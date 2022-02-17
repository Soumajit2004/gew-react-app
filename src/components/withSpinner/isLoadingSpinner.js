import React from "react";
import {CircularProgress} from "@mui/material";

const LoadingSpinner = ({isLoading, children}) => {
    return <div
        style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px 0px"
        }}>
        <CircularProgress color="primary"/>
    </div>
}

export default LoadingSpinner