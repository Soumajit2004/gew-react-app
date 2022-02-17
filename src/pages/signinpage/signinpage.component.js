import React from "react";
import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithPhoneNumber,
    RecaptchaVerifier
} from "firebase/auth";
import {
    query,
    where,
    collection, getDocs
} from "firebase/firestore";
import {
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid, IconButton, InputAdornment,
    Link,
    Paper, Snackbar, Stack,
    TextField,
    Typography
} from "@mui/material";
import "./signinpage.styles.scss";
import { auth, db } from "../../firebase/firebase.utils";
import { Close } from "@mui/icons-material";
import isEmail from "validator/es/lib/isEmail";
import Divider from "@mui/material/Divider";
import isMobilePhone from "validator/es/lib/isMobilePhone";

class SignInPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            snackbarOpen: false,
            recaptchaReady: false,
            snackbarMessage: "",
            otpOpen: false,
            otp: "",
            verifier: null,
            email: "",
            password: "",
            phoneNumber: ""
        }

    }

    recaptchaVerifier = () => {
        if (!this.state.recaptchaReady) {
            window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
            }, auth)
            this.setState({ recaptchaReady: true })
        }
    }

    handleSubmit = (event) => {
        const {
            email,
            password,
            phoneNumber
        } = this.state

        if (isEmail(email) && password) {
            signInWithEmailAndPassword(auth, email, password)
                .catch((error) => {
                    this.showError(error.toString())
                });
        } else if (isMobilePhone(phoneNumber)) {

            getDocs(query(collection(db, "users"), where("phoneNumber", "==", `+91${phoneNumber}`)))
                .then(r => {
                    try {

                        const user = r.docs[0].data()
                        if (user.phoneNumber === `+91${phoneNumber}` && user.authMethod === `phone`) {
                            this.recaptchaVerifier()
                            const appVerifier = window.recaptchaVerifier;

                            return signInWithPhoneNumber(auth, `+91${phoneNumber}`, appVerifier)
                                .then(r => {
                                    this.setState({ verifier: r })
                                    this.setOtpDialog(true)
                                })
                                .catch((error) => {
                                    this.showError(error.toString())
                                })
                        } else { this.showError("Sign-in with your email & password") }


                    }
                    catch (error) { 
                        this.showError("Phone no not registered !")
                    }
                })
                .catch((e) => {
                    this.showError(e.toString())
                })

        } else {
            this.showError("Invalid details")
        }
    };

    confirmOtp = () => {
        const {
            otp,
            verifier
        } = this.state

        try {
            verifier.confirm(otp)
            this.setOtpDialog(false)
        } catch (e) {
        }
    }

    handleForgotPassword = () => {
        if (this.state.email) {
            sendPasswordResetEmail(auth, this.state.email)
                .then(() => {
                    this.showError("Password reset email sent")
                })
                .catch((error) => {
                    this.showError(error.message)
                });
        } else {
            this.showError("Enter your email in email field")
        }
    }

    snackbarAction = (
        <IconButton onClick={() => this.setState({ snackbarOpen: false })}>
            <Close />
        </IconButton>
    )

    showError = (message) => {
        this.setState({ snackbarOpen: true, snackbarMessage: message })
    }

    setOtpDialog = (bool) => {
        this.setState({ otpOpen: bool })
    }

    render() {
        return <Grid container component="main" sx={{ height: '100vh' }}>
            <div id='recaptcha-container' />
            <Snackbar open={this.state.snackbarOpen}
                action={this.snackbarAction}
                autoHideDuration={6000}
                message={this.state.snackbarMessage}
                onClose={() => {
                    this.setState({ snackbarOpen: false })
                }}
            />
            <Dialog open={this.state.otpOpen}
                disableEscapeKeyDown={true}
                onClose={() => {
                    this.setOtpDialog(false)
                }}>
                <DialogTitle>Enter OTP</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {`An OTP has been send to +91${this.state.phoneNumber}`}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="otp"
                        label="OTP"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            this.setState({ otp: e.target.value })
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        this.setOtpDialog(false)
                    }}>Cancel</Button>
                    <Button onClick={this.confirmOtp}>Login</Button>
                </DialogActions>
            </Dialog>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                className="cover-image"
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={{ display: "grid" }}>
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
                    <Stack width="80%" spacing={2}>
                        <Box>
                            <TextField
                                margin="normal"
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={e => this.setState({ email: e.target.value })}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={e => this.setState({ password: e.target.value })}
                            />
                        </Box>
                        <Divider />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="phone"
                            label="Phone Number"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                            }}
                            id="phone"
                            autoComplete="phone-number"
                            onChange={e => this.setState({ phoneNumber: e.target.value })}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            id="sign-in-button"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={this.handleSubmit}
                        >
                            Sign In
                        </Button>
                        {
                            this.state.verifier ? <Button
                                fullWidth
                                id="otp-button"
                                variant="outlined"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={() => {
                                    this.setOtpDialog(true)
                                }}
                            >
                                Enter OTP
                            </Button> : null
                        }

                        <Grid container style={{ display: "flex", justifyContent: "center" }}>
                            <Grid item>
                                <Link variant="body2" onClick={this.handleForgotPassword}>
                                    Forgot password?
                                </Link>
                            </Grid>
                        </Grid>
                    </Stack>

                </Box>
            </Grid>
        </Grid>
    }
}

export default SignInPage