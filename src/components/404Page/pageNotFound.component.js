import {Container, Typography} from "@mui/material";
import React from "react";

const PageNotFound = () => {
    return <Container style={{height: "100vh", display: "flex", flexDirection: "column", justifyContent:"center"}}>
        <Typography variant="h1" fontWeight={600} align="center" color="error">
            404
        </Typography>
        <Typography variant="h3" fontWeight={400} align="center" color="error" marginTop={5}>
            Page Not Found !
        </Typography>
    </Container>
}

export default PageNotFound