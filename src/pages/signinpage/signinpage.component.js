import React from "react";
import {signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import {
    Box,
    Button,
    Grid, IconButton,
    Link,
    Paper, Snackbar,
    TextField,
    Typography
} from "@mui/material";
import "./signinpage.styles.scss";
import {auth} from "../../firebase/firebase.utils";
import {withRouter} from "react-router";
import {Close} from "@mui/icons-material";

class SignInPage extends React.Component {
    constructor(props) {
        super(props);

        this.auth = auth
        this.history = props.history

        this.state = {
            snackbarOpen: false,
            snackbarMessage: "",
            email: "",
            password: "",
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();


        signInWithEmailAndPassword(this.auth, this.state.email, this.state.password)
            .then((userCredential) => {
                this.history.push("/office/dashboard")
            })
            .catch((error) => {
                this.showError(error.toString())
            });

    };

    handleForgotPassword = () => {
        if (this.state.email) {
            sendPasswordResetEmail(auth, this.state.email)
                .then(() => {
                    this.showError("Password reset email sent")
                })
                .catch((error) => {
                    this.showError(error.message)
                });
        }else{
            this.showError("Enter your email in email field")
        }
    }

    snackbarAction = (
        <IconButton onClick={() => this.setState({snackbarOpen: false})}>
            <Close/>
        </IconButton>
    )

    showError = (message) => {
        this.setState({snackbarOpen: true, snackbarMessage: message})
    }

    render() {

        return <Grid container component="main" sx={{height: '100vh'}}>
            <Snackbar open={this.state.snackbarOpen}
                      action={this.snackbarAction}
                      autoHideDuration={6000}
                      message={this.state.snackbarMessage}
                      onClose={() => {
                          this.setState({snackbarOpen: false})
                      }}
            />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                className="cover-image"
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={{display: "grid"}}>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        alignSelf: "center",
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h2" variant="h2" fontWeight={600}>
                        Sign in
                    </Typography>
                    <Box component="form" noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={e => this.setState({email: e.target.value})}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={e => this.setState({password: e.target.value})}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            onClick={this.handleSubmit}
                        >
                            Sign In
                        </Button>
                        <Grid container style={{display: "flex", justifyContent: "center"}}>
                            <Grid item>
                                <Link variant="body2" onClick={this.handleForgotPassword}>
                                    Forgot password?
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    }
}

export default withRouter(SignInPage)