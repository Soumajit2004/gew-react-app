import React from "react"
import {Container, Typography} from "@mui/material";

class ErrorBoundary extends React.Component {
    state = {
        hasErrored: false
    }

    static getDerivedStateFromError(error) {

        return {hasErrored: true}
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log(error)
    }

    render() {
        if (this.state.hasErrored) {
            return (
                <Container style={{height: "100vh", display: "flex", flexDirection: "column", justifyContent:"center"}}>
                    <Typography variant="h2" fontWeight={600} align="center" color="error">
                        Something Went Wrong !
                    </Typography>
                    <Typography variant="h5" fontWeight={400} align="center" color="error" marginTop={5}>
                        Check your internet connection or try again later
                    </Typography>
                </Container>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary