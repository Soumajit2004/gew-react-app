import React from "react";
import HeaderComponent from "../../components/header/header.component";
import {
    Button,
    Container,
    FormControl, Grid,
    Grow, IconButton, InputAdornment,
    InputLabel,
    MenuItem,
    Paper, Select, Snackbar, Stack,
    TextField,
    Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth, createUserWithPhone, db} from "../../firebase/firebase.utils";
import isEmail from 'validator/es/lib/isEmail';
import isStrongPassword from 'validator/es/lib/isStrongPassword';
import isMobilePhone from "validator/es/lib/isMobilePhone";
import isNumeric from "validator/es/lib/isNumeric";
import {collection, doc, getDocs, query, setDoc, where} from "firebase/firestore";
import {Close, CurrencyRupee} from "@mui/icons-material";
import IsLoadingSpinner from "../../components/withSpinner/isLoadingSpinner";

class RegisterPage extends React.Component {

    state = {
        name: "",
        password: "",
        email: "",
        phoneNumber: "",
        bankAccountNumber: "",
        cnfBankAccountNumber: "",
        ifscCode: "",
        salary: "",
        role: "office",
        authentication: "phone",
        snackbarOpen: false,
        snackbarMessage: "",
        isLoading: false,
    }

    validateBankDetails = () => {
        const {
            bankAccountNumber,
            cnfBankAccountNumber,
            ifscCode
        } = this.state

        if (bankAccountNumber && cnfBankAccountNumber && ifscCode && bankAccountNumber === cnfBankAccountNumber) {
            return true
        } else {
            this.showError("Invalid Bank Details !")
            return false
        }
    }

    isPhoneAuth = () => this.state.authentication === "phone"

    validate = () => {
        const {
            name,
            password,
            email,
            phoneNumber,
            salary,
            role,
        } = this.state

        if (this.isPhoneAuth()) {
            return !!(name && isMobilePhone(phoneNumber) && isNumeric(salary) && role && this.validateBankDetails());
        } else {
            if (name && isEmail(email) && isMobilePhone(phoneNumber) && isNumeric(salary) && role) {
                if (isStrongPassword(password)) {
                    return this.validateBankDetails();
                } else {
                    this.showError("Enter a strong password")
                    return false
                }
            } else {
                this.showError("All fields are mandatory")
                return false
            }
        }

    }

    refresh = () => {
        this.setState({
            name: "",
            password: "",
            email: "",
            phoneNumber: "",
            bankAccountNumber: "",
            cnfBankAccountNumber: "",
            ifscCode: "",
            salary: "",
            role: "office",
            authentication: "phone",
        })
    }

    snackbarAction = (
        <IconButton color="inherit" onClick={() => this.setState({snackbarOpen: false})}>
            <Close/>
        </IconButton>
    )

    showError = (message) => {
        this.setState({snackbarOpen: true, snackbarMessage: message})
    }

    toggleLoading = () => {this.setState({isLoading: !this.state.isLoading})}

    firestoreRegister = async (uid) => {
        const {
            name,
            phoneNumber,
            bankAccountNumber,
            ifscCode,
            salary,
            role,
            authentication
        } = this.state

        try {
            const userRef = doc(db, "users", uid)

                await setDoc(userRef, {
                    name: name,
                    phoneNumber: `+91${phoneNumber.toString()}`,
                    bankAccountNumber: bankAccountNumber,
                    ifscCode: ifscCode,
                    salary: salary,
                    role: role,
                    authMethod: authentication
                })

            this.showError("User Created!")
        } catch (e) {
            this.showError(e.toString())
        }
    }

    handleRegister = async () => {
        const {
            password,
            email,
            phoneNumber,
        } = this.state
        const parsedPhNo = `+91${phoneNumber.toString()}`

        if (this.validate()) {
            this.toggleLoading()

            const usersDB = await getDocs(query(collection(db, "users"), where("phoneNumber", "==", parsedPhNo)))
            if (usersDB.size > 0){
                this.showError("Duplicate Phone Number !")
            }else{
                if (this.isPhoneAuth()) {
                    try {
                        const phoneUser = await createUserWithPhone({phoneNumber: parsedPhNo})

                        await this.firestoreRegister(phoneUser.data.uid)
                        this.refresh()
                    } catch (e) {
                        this.showError("Failed to create user")
                    }

                } else {
                    try {
                        const user = await createUserWithEmailAndPassword(auth, email, password)

                        await this.firestoreRegister(user.user.uid)
                        this.refresh()
                    } catch (e) {
                        this.showError("Failed to create user")
                    }
                }
            }
            this.toggleLoading()
        }

    }

    render() {
        const {isLoading} = this.state

        return (
            <HeaderComponent title="Register">
                <Container style={{height: "80vh"}}>
                    <Stack spacing={4}>
                        <Snackbar open={this.state.snackbarOpen}
                                  action={this.snackbarAction}
                                  autoHideDuration={6000}
                                  message={this.state.snackbarMessage}
                                  onClose={() => {
                                      this.setState({snackbarOpen: false})
                                  }}
                        />
                        <Typography variant="h2" fontWeight={500} align="center">Register</Typography>
                        {
                            isLoading ?
                                (<IsLoadingSpinner/>) : (
                                    <Stack spacing={4} padding={2}>
                                        <Grow in>
                                            <Grid container spacing={4}>
                                                <Grid item sm={12} md={6} style={{width: "100%"}}>
                                                    <Stack spacing={2}>
                                                        <Paper elevation={6}>
                                                            <Stack spacing={2} padding={2}>
                                                                <Typography variant="h5">Personal Details</Typography>
                                                                <TextField
                                                                    label="Name"
                                                                    variant="filled"
                                                                    value={this.state.name}
                                                                    onChange={(e) => {
                                                                        this.setState({name: e.target.value})
                                                                    }}
                                                                    fullWidth/>
                                                                <TextField
                                                                    label="Email"
                                                                    variant="filled"
                                                                    disabled={this.isPhoneAuth()}
                                                                    value={this.state.email}
                                                                    onChange={(e) => {
                                                                        this.setState({email: e.target.value})
                                                                    }}
                                                                    fullWidth/>
                                                                <TextField
                                                                    label="Password"
                                                                    variant="filled"
                                                                    disabled={this.isPhoneAuth()}
                                                                    value={this.state.password}
                                                                    onChange={(e) => {
                                                                        this.setState({password: e.target.value})
                                                                    }}
                                                                    fullWidth/>
                                                                <TextField
                                                                    label="Phone No"
                                                                    variant="filled"
                                                                    InputProps={{
                                                                        startAdornment: <InputAdornment
                                                                            position="start">+91</InputAdornment>,
                                                                    }}
                                                                    value={this.state.phoneNumber}
                                                                    onChange={(e) => {
                                                                        this.setState({phoneNumber: e.target.value})
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
                                                                    <InputLabel id="role-selection">Authentication
                                                                        Method</InputLabel>
                                                                    <Select
                                                                        labelId="role-selection"
                                                                        id="role-selection"
                                                                        value={this.state.authentication}
                                                                        onChange={(e) => {
                                                                            this.setState({authentication: e.target.value})
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
                                                                        id="role-selection"
                                                                        value={this.state.role}
                                                                        onChange={(e) => {
                                                                            this.setState({role: e.target.value})
                                                                        }}
                                                                    >
                                                                        <MenuItem value="office">Office Employee</MenuItem>
                                                                        <MenuItem value="field">Field Employee</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                                <TextField label="Salary"
                                                                           variant="filled"
                                                                           value={this.state.salary}
                                                                           InputProps={{
                                                                               startAdornment: <InputAdornment
                                                                                   position="start"><CurrencyRupee/></InputAdornment>,
                                                                           }}
                                                                           onChange={(e) => {
                                                                               this.setState({salary: e.target.value})
                                                                           }}
                                                                           fullWidth/>
                                                            </Stack>
                                                        </Paper>
                                                        <Paper elevation={6}>
                                                            <Stack spacing={2} padding={2}>
                                                                <Typography variant="h5">Bank Details</Typography>
                                                                <TextField label="Bank Account"
                                                                           variant="filled"
                                                                           value={this.state.bankAccountNumber}
                                                                           onChange={(e) => {
                                                                               this.setState({bankAccountNumber: e.target.value})
                                                                           }}
                                                                           fullWidth/>
                                                                <TextField label="Re-Enter Bank Account"
                                                                           variant="filled"
                                                                           type="password"
                                                                           value={this.state.cnfBankAccountNumber}
                                                                           onChange={(e) => {
                                                                               this.setState({cnfBankAccountNumber: e.target.value})
                                                                           }}
                                                                           fullWidth/>
                                                                <TextField label="IFSC Code"
                                                                           variant="filled"
                                                                           value={this.state.ifscCode}
                                                                           onChange={(e) => {
                                                                               this.setState({ifscCode: e.target.value})
                                                                           }}
                                                                           fullWidth/>
                                                            </Stack>
                                                        </Paper>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grow>
                                        <Grow in>
                                            <Box style={{display: "flex", justifyContent: "center", gap: "20px"}}>
                                                <Button variant="contained" style={{padding: "10px 20px"}}
                                                        onClick={this.handleRegister}>Register</Button>
                                                <Button variant="outlined" style={{padding: "10px 20px"}}
                                                        onClick={this.refresh}>Clear</Button>
                                            </Box>
                                        </Grow>
                                    </Stack>
                                )
                        }
                    </Stack>
                </Container>
            </HeaderComponent>
        );
    }

}

export default RegisterPage