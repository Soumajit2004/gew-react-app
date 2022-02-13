import React from "react";
import "./homepage.styles.scss";
import {Button, Container,Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";

const HomePage = () => (
    <div className="home-page">
        <Container
            style=
                {{
                    height: "100%",
                    display: "flex",
                    alignItems: "center"
                }}
            maxWidth="lg"
            children={
                <Stack spacing={2}>
                    <Typography variant="h3" component="h3" color="white">
                        Welcome to
                    </Typography>
                    <Typography variant="h1" component="h1" fontSize={80} fontWeight={600} color="white">
                        Ghosh Electrical Works
                    </Typography>
                    <Box>
                        <Button variant="contained" href="/sign-in">Dashboard</Button>
                    </Box>
                </Stack>
            }/>
    </div>
)

export default HomePage