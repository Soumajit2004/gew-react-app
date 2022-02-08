import React from "react";
import "./homepage.styles.scss";
import {Button, Container, Grid, Stack, Typography} from "@mui/material";

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
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button variant="contained" href="/sign-in">Admin Portal</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="secondary" href="/contact">Contact</Button>
                        </Grid>
                    </Grid>
                </Stack>
            }/>
    </div>
)

export default HomePage