import {
    Box,
    Button, Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    InputAdornment,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import Divider from "@mui/material/Divider";
import React, {useState} from "react";
import {
    RecaptchaVerifier,
    signInWithEmailAndPassword,
    signInWithPhoneNumber
} from "firebase/auth";
import {auth, db} from "../../firebase/firebase.utils";
import isEmail from "validator/es/lib/isEmail";
import isMobilePhone from "validator/es/lib/isMobilePhone";
import {collection, getDocs, query, where} from "firebase/firestore";
import {showMessage} from "../../redux/snackbar/snackbar.actions";
import {useDispatch} from "react-redux";

const SignInForm = () => {
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [otp, setOTP] = useState("")
    const [isRecaptchaReady, setRecaptchaReady] = useState(false)

    const dispatch = useDispatch()
    const showMessageHandler = msg => {dispatch(showMessage(msg))}

    const recaptchaVerifier = () => {
        if (!isRecaptchaReady) {
            window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
            }, auth)
            setRecaptchaReady(true)
        }
    }

    const confirmOtp = () => {
        try {
            window.otpVerifier.confirm(otp)
            setDialogOpen(false)
        } catch (e) {
            showMessageHandler(e.message)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const data = new FormData(event.currentTarget)
            const email = data.get("email"), password = data.get("password"), phoneNumber = data.get("phoneNumber")

            if (isEmail(email) && password) {
                await signInWithEmailAndPassword(auth, email, password)
            } else if (isMobilePhone(phoneNumber)) {
                const response = await getDocs(query(collection(db, "users"), where("phoneNumber", "==", `+91${phoneNumber}`)))

                const user = response.docs[0].data() | ""

                if (user.phoneNumber === `+91${phoneNumber}` && user.authMethod === `phone`) {
                    recaptchaVerifier()
                    const appVerifier = window.recaptchaVerifier;
                    window.otpVerifier = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, appVerifier)
                    setDialogOpen(true)
                }
            } else {
                throw Error("Invalid Data")
            }
        } catch (e) {
            showMessageHandler(e.message)
        }
    };

    const OTPDialog = () => {
        return <Dialog open={isDialogOpen}
                       disableEscapeKeyDown={true}
                       onClose={() => {
                           setDialogOpen(false)
                       }}>
            <DialogTitle>Enter OTP</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {`An OTP has been send to your registered phone no`}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="otp"
                    label="OTP"
                    fullWidth
                    variant="standard"
                    onChange={(e) => {
                        setOTP(e.target.value)
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    setDialogOpen(false)
                }}>Cancel</Button>
                <Button onClick={confirmOtp}>Login</Button>
            </DialogActions>
        </Dialog>
    }

    return (
        <Box
            sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                alignSelf: "center",
                flexDirection: 'column',
                alignItems: 'center',
            }}
            component="form"
            onSubmit={handleSubmit}
        >
            <div id='recaptcha-container'/>
            <OTPDialog/>

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
                        autoFocus
                        type="email"
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                    />
                </Box>
                <Divider/>
                <TextField
                    margin="normal"
                    fullWidth
                    name="phoneNumber"
                    label="Phone Number"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                    }}
                    id="phoneNumber"
                    type="number"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                >
                    Sign In
                </Button>
                {
                    window.recaptchaVerifier ? <Button
                        fullWidth
                        id="otp-button"
                        variant="outlined"
                        sx={{mt: 3, mb: 2}}
                        onClick={() => {
                            setDialogOpen(true)
                        }}
                    >
                        Enter OTP
                    </Button> : null
                }
            </Stack>
        </Box>
    )
}

export default SignInForm