import {AppBar, Button, Container, Fade, Stack, Typography} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Footer from "../footer/footer.component";
import React from "react";
import "./visitorHeader.styles.scss"

const VisitorHeader = ({children}) => {

    return <Fade in>
        <Stack>
            <AppBar position="static" color="secondary" elevation={0}>
                <Container>
                    <Toolbar disableGutters style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        <Typography
                            variant="h6"
                        >
                            {"Ghosh Electrical Works"}
                        </Typography>
                        <Button
                            sx={{my: 2, color: 'white'}}
                            href={"/dashboard"}
                        >
                            {"Dashboard"}
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>
            {children}
            <Footer/>
        </Stack>
    </Fade>
}

export default VisitorHeader