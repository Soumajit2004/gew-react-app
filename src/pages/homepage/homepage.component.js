import React from "react";
import "./homepage.styles.scss";
import {Button, Container, Fade, Stack, Typography} from "@mui/material";
import RazorpayButton from "../../components/razorpay-button/razorpayButton.component";

const HomePage = () => (
    <Fade in>
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
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" href="/sign-in">Dashboard</Button>
                        <RazorpayButton/>
                    </Stack>
                </Stack>
            }/>
    </div>
    </Fade>
)

export default HomePage