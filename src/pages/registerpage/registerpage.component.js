import React, {useState} from "react";
import HeaderComponent from "../../components/header/header.component";
import {
    Button,
    Container,
    FormControl, Grid,
    Grow, InputAdornment,
    InputLabel,
    MenuItem,
    Paper, Select, Stack,
    TextField,
    Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {createUserWithPhone, db} from "../../firebase/firebase.utils";
import {collection, doc, getDocs, query, setDoc, where} from "firebase/firestore";
import {CurrencyRupee} from "@mui/icons-material";
import IsLoadingSpinner from "../../components/withSpinner/isLoadingSpinner";
import {connect} from "react-redux";
import {showMessage} from "../../redux/snackbar/snackbar.actions";
import isMobilePhone from "validator/es/lib/isMobilePhone";

const RegisterPage = ({showMessage}) => {

    const [isLoading, setLoading] = useState(false)
    const [isPhoneAuth, setPhoneAuth] = useState(true)
    const [auth, setAuth] = useState("phone")
    const [role, setRole] = useState("office")

    const firestoreRegister = async (uid, formData) => {
        try {
            const userRef = doc(db, "users", uid)

            await setDoc(userRef, {
                name: formData.get("name"),
                phoneNumber: `+91${formData.get("phNo")}`,
                bankAccountNumber: formData.get("accNo"),
                ifscCode: formData.get("ifscCode"),
                salary: formData.get("salary"),
                role: formData.get("role"),
                authMethod: formData.get("auth")
            })

            showMessage("User Created !")
        } catch (e) {
            showMessage(e.message)
        }
    }

    const validate = (formData) => {
        if (isMobilePhone(formData.get("phNo")) && (formData.get("accNo").toString() === formData.get("accNoC").toString())) {
            return true
        } else {
            showMessage("Invalid Data")
            return false
        }
    }

    const handleRegister = async (event) => {
        event.preventDefault()
        // name, email, phNo, auth, role, accNo, accNoC, ifscCode, password, salary
        const data = new FormData(event.currentTarget)

        if (validate(data)) {
            const parsedPhNo = `+91${data.get("phNo").toString()}`

            setLoading(true)

            const usersDB = await getDocs(query(collection(db, "users"), where("phoneNumber", "==", parsedPhNo)))
            if (usersDB.size > 0) {
                showMessage("Duplicate Phone Number !")
            } else {
                if (isPhoneAuth) {
                    try {
                        const phoneUser = await createUserWithPhone({phoneNumber: parsedPhNo})

                        await firestoreRegister(phoneUser.data.uid, data)

                        showMessage("User Created !")
                    } catch (e) {
                        showMessage("Failed to create user !")
                    }
                } else {
                    try {
                        const user = await createUserWithEmailAndPassword(auth, data.get("email"), data.get("password"))

                        await firestoreRegister(user.user.uid, data)
                    } catch (e) {
                        showMessage("Failed to create user !")
                    }
                }
                window.location.reload()
            }
            setLoading(false)
        }

    }


    return (
        <HeaderComponent title="Register">
            <Container style={{height: "80vh"}}>

                <Stack spacing={4}>
                    <Typography variant="h2" fontWeight={500} align="center">Register</Typography>
                    {
                        isLoading ?
                            (<IsLoadingSpinner/>) : (
                                <Grow in>
                                    <Box component="form" onSubmit={handleRegister}>
                                        <Grid container spacing={4}>
                                            <Grid item sm={12} md={6} style={{width: "100%"}}>
                                                <Stack spacing={2}>
                                                    <Paper elevation={6}>
                                                        <Stack spacing={2} padding={2}>
                                                            <Typography variant="h5">Personal Details</Typography>
                                                            <TextField
                                                                name="name"
                                                                label="Name"
                                                                variant="filled"
                                                                required
                                                                fullWidth/>
                                                            <TextField
                                                                label="Email"
                                                                type="email"
                                                                name="email"
                                                                variant="filled"
                                                                disabled={isPhoneAuth}
                                                                required={!isPhoneAuth}
                                                                fullWidth/>
                                                            <TextField
                                                                label="Password"
                                                                variant="filled"
                                                                min={8}
                                                                name="password"
                                                                required={!isPhoneAuth}
                                                                disabled={isPhoneAuth}
                                                                fullWidth/>
                                                            <TextField
                                                                label="Phone No"
                                                                name="phNo"
                                                                min={10}
                                                                max={11}
                                                                variant="filled"
                                                                type="number"
                                                                InputProps={{
                                                                    startAdornment: <InputAdornment
                                                                        position="start">+91</InputAdornment>,
                                                                }}
                                                                fullWidth/>
                                                        </Stack>
                                                    </Paper>
                                                    <Paper elevation={6}>
                                                        <Stack spacing={1.5} padding={2}>
                                                            <Typography variant="h5">Important Note!</Typography>
                                                            <Typography>
                                                                To create a user with phone authentication set
                                                                authentication
                                                                method to phone and keep the email and password fields
                                                                empty.
                                                            </Typography>
                                                            <Typography>
                                                                Users created using email cannot sign-in with their
                                                                phone number.
                                                                To use email authentication change authentication method
                                                                to
                                                                email in which all fields are mandatory
                                                            </Typography>
                                                        </Stack>
                                                    </Paper>
                                                </Stack>
                                            </Grid>
                                            <Grid item sm={12} md={6} style={{width: "100%"}}>
                                                <Stack spacing={2}>
                                                    <Paper elevation={6}>
                                                        <Stack spacing={2} padding={2}>
                                                            <Typography variant="h5">Office Details</Typography>
                                                            <FormControl variant="filled" fullWidth>
                                                                <InputLabel id="auth-method">Authentication
                                                                    Method</InputLabel>
                                                                <Select
                                                                    labelId="auth-method"
                                                                    name="auth"
                                                                    required
                                                                    value={auth}
                                                                    onChange={(v) => {
                                                                        setAuth(v.target.value)
                                                                        v.target.value === "phone" ? setPhoneAuth(true) : setPhoneAuth(false)
                                                                    }}
                                                                >
                                                                    <MenuItem value="phone">Phone</MenuItem>
                                                                    <MenuItem value="email">Email</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                            <FormControl variant="filled" fullWidth>
                                                                <InputLabel id="role-selection">Role</InputLabel>
                                                                <Select
                                                                    labelId="role-selection"
                                                                    name="role"
                                                                    value={role}
                                                                    required
                                                                    onChange={(v) => {setRole(v.target.value)}}
                                                                >
                                                                    <MenuItem value="office">Office Employee</MenuItem>
                                                                    <MenuItem value="field">Field Employee</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                            <TextField name="salary"
                                                                       type="number"
                                                                       label="Salary"
                                                                       variant="filled"
                                                                       InputProps={{
                                                                           startAdornment: <InputAdornment position="start"><CurrencyRupee/></InputAdornment>,
                                                                       }}
                                                                       required
                                                                       fullWidth/>
                                                        </Stack>
                                                    </Paper>
                                                    <Paper elevation={6}>
                                                        <Stack spacing={2} padding={2}>
                                                            <Typography variant="h5">Bank Details</Typography>
                                                            <TextField label="Bank Account"
                                                                       variant="filled"
                                                                       name="accNo"
                                                                       type="number"
                                                                       required
                                                                       fullWidth/>
                                                            <TextField label="Re-Enter Bank Account"
                                                                       variant="filled"
                                                                       name="accNoC"
                                                                       required
                                                                       type="password"
                                                                       fullWidth/>
                                                            <TextField label="IFSC Code"
                                                                       variant="filled"
                                                                       name="ifscCode"
                                                                       required
                                                                       fullWidth/>
                                                        </Stack>
                                                    </Paper>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Box style={{display: "flex", justifyContent: "center", gap: "20px"}}>
                                                    <Button variant="contained" type="submit"
                                                            style={{padding: "10px 20px"}}>Register</Button>
                                                    <Button variant="outlined" style={{padding: "10px 20px"}}
                                                            onClick={() => {
                                                                window.location.reload()
                                                            }}>Clear</Button>
                                                </Box>
                                            </Grid>
                                        </Grid>

                                    </Box>
                                </Grow>
                            )
                    }
                </Stack>
            </Container>
        </HeaderComponent>
    );


}

const mapDispatchToProp = dispatch => ({
    showMessage: message => dispatch(showMessage(message))
})

export default connect(null, mapDispatchToProp)(RegisterPage)