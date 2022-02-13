import React from "react";
import HeaderComponent from "../../components/header/header.component";
import {
    Button,
    Container,
    FormControl, Grid,
    Grow, IconButton,
    InputLabel,
    MenuItem,
    Paper, Select, Snackbar, Stack,
    TextField,
    Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "../../firebase/firebase.utils";
import isEmail from 'validator/es/lib/isEmail';
import isStrongPassword from 'validator/es/lib/isStrongPassword';
import isMobilePhone from "validator/es/lib/isMobilePhone";
import isNumeric from "validator/es/lib/isNumeric";
import {doc, setDoc} from "firebase/firestore";
import {deleteUser} from "firebase/auth";
import {Close} from "@mui/icons-material";

class RegisterPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            password: "",
            email: "",
            phoneNumber: "",
            bankAccountNumber: "",
            cnfBankAccountNumber: "",
            ifscCode: "",
            address: "",
            salary: "",
            role: "office",
            snackbarOpen: false,
            snackbarMessage: "",
        }
    }

    validateBankDetails = () => {
        const {
            bankAccountNumber,
            cnfBankAccountNumber,
            ifscCode
        } = this.state

        if (bankAccountNumber && cnfBankAccountNumber && ifscCode) {
            if (bankAccountNumber === cnfBankAccountNumber) {
                return true
            } else {
                this.showError("Check Bank Details")
                return false
            }
        } else {
            this.showError("Bank Details Are Required")
            return false
        }
    }

    validate = () => {
        const {
            name,
            password,
            email,
            phoneNumber,
            address,
            salary,
            role
        } = this.state

        if (name && isEmail(email) && isMobilePhone(phoneNumber) && isNumeric(salary) && role && address) {
            if (isStrongPassword(password)) {
                return this.validateBankDetails();
            } else {
                this.showError("Enter a strong password")
                return false
            }
        } else {
            this.showError("Enter a fields correctly")
            return false
        }
    }

    snackbarAction = (
        <IconButton color="inherit" onClick={() => this.setState({snackbarOpen: false})}>
            <Close/>
        </IconButton>
    )

    showError = (message) => {
        this.setState({snackbarOpen: true, snackbarMessage: message})
    }


    handleRegister = () => {
        const {
            name,
            password,
            email,
            phoneNumber,
            bankAccountNumber,
            ifscCode,
            address,
            salary,
            role
        } = this.state

        if (this.validate()) {
            createUserWithEmailAndPassword(auth, email, password)
                .then(r => {
                    const userRef = doc(db, "users", r.user.uid)
                    setDoc(userRef, {
                        name: name,
                        phoneNumber: parseInt(phoneNumber),
                        bankAccountNumber: parseInt(bankAccountNumber),
                        ifscCode: ifscCode,
                        address: address,
                        salary: parseInt(salary),
                        role: role
                    })
                        .then(r => {
                            this.showError("User Created!")
                            window.location.reload();
                        })
                        .catch(e => {
                            this.showError(e.toString())
                            deleteUser(auth.currentUser).then(() => {
                                console.log("User Deleted")
                            })
                        })
                })
                .catch(() => {
                    this.showError("Failed to create user")
                })
        }
    }

    render() {
        return (
            <HeaderComponent title="Register">
                <Container style={{height:"80vh"}}>
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
                        <Box>
                            <Grow in>
                                <Grid container spacing={4}>
                                    <Grid item sm={12} md={6} style={{width: "100%"}}>
                                        <Paper elevation={6}>
                                            <Stack spacing={2} padding={2}>
                                                <Typography variant="h5">Personal Details</Typography>
                                                <TextField
                                                    label="Name"
                                                    variant="filled"
                                                    onChange={(e) => {
                                                        this.setState({name: e.target.value})
                                                    }}
                                                    fullWidth/>

                                                <TextField
                                                    label="Password"
                                                    variant="filled"
                                                    onChange={(e) => {
                                                        this.setState({password: e.target.value})
                                                    }}
                                                    fullWidth/>

                                                <TextField
                                                    label="Email"
                                                    variant="filled"
                                                    onChange={(e) => {
                                                        this.setState({email: e.target.value})
                                                    }}
                                                    fullWidth/>

                                                <TextField
                                                    label="Phone No"
                                                    variant="filled"
                                                    onChange={(e) => {
                                                        this.setState({phoneNumber: e.target.value})
                                                    }}
                                                    type="number"
                                                    fullWidth/>

                                                <TextField label="Address"
                                                           variant="filled"
                                                           onChange={(e) => {
                                                               this.setState({address: e.target.value})
                                                           }}
                                                           fullWidth/>
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                    <Grid item sm={12} md={6} style={{width: "100%"}}>
                                        <Paper elevation={6}>
                                            <Stack spacing={2} padding={2}>
                                                <Typography variant="h5">Office Details</Typography>
                                                <TextField label="Bank Account"
                                                           variant="filled"
                                                           onChange={(e) => {
                                                               this.setState({bankAccountNumber: e.target.value})
                                                           }}
                                                           fullWidth/>
                                                <TextField label="Re-Enter Bank Account"
                                                           variant="filled"
                                                           type="password"
                                                           onChange={(e) => {
                                                               this.setState({cnfBankAccountNumber: e.target.value})
                                                           }}
                                                           fullWidth/>
                                                <TextField label="Salary"
                                                           variant="filled"
                                                           onChange={(e) => {
                                                               this.setState({salary: e.target.value})
                                                           }}
                                                           fullWidth/>

                                                <TextField label="IFSC Code"
                                                           variant="filled"
                                                           onChange={(e) => {
                                                               this.setState({ifscCode: e.target.value})
                                                           }}
                                                           fullWidth/>
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
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grow>
                        </Box>
                        <Grow in>
                            <Box style={{display: "flex", justifyContent: "center", gap: "20px"}}>
                                <Button variant="contained" style={{padding: "10px 20px"}}
                                        onClick={this.handleRegister}>Register</Button>
                                <Button variant="outlined" style={{padding: "10px 20px"}}>Clear</Button>
                            </Box>
                        </Grow>
                    </Stack>
                </Container>
            </HeaderComponent>
        );
    }

}

export default RegisterPage