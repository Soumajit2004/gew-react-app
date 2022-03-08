import React from "react";
import {
    Fade,
    Grid,
    Paper
} from "@mui/material";
import "./signinpage.styles.scss";
import SignInForm from "../../components/signin-form/signin-form.component";

const SignInPage = () => {
    return (
        <Fade in>
            <Grid container component="main" sx={{height: '100vh'}}>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    className="cover-image"
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={{display: "grid"}}>
                    <SignInForm/>
                </Grid>
            </Grid>
        </Fade>
    )
}

export default SignInPage