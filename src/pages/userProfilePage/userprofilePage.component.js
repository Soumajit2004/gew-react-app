import HeaderComponent from "../../components/header/header.component";
import {Container, Grid, Paper, Stack} from "@mui/material";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/user/user.selector";
import Box from "@mui/material/Box";
import "./userProfile.styles.scss"


const UserProfilePage = () => {
    const user = useSelector(selectCurrentUser)

    const isEmailAuth = () => user.authMethod === "email"

    return <HeaderComponent title="Profile">
        <Container style={{height: "80vh"}}>
            <Paper elevation={6} style={{overflowY: "scroll"}}>
                <Stack divider={<Divider/>} spacing={2} padding={3}>
                    <Typography variant="h3" fontWeight={600}>
                        {user.name}
                    </Typography>
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item md={12} lg={6}>
                                <Paper variant="outlined">
                                    <Stack spacing={1} divider={<Divider/>} padding={1}>
                                        <Typography variant="h5">
                                            Personal Details
                                        </Typography>
                                        <Box>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Typography variant="h6">
                                                        Name:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="h6">
                                                        {user.name}
                                                    </Typography>
                                                </Grid>
                                                {
                                                    isEmailAuth() ?
                                                        <Grid item xs={6}>
                                                            <Typography variant="h6">
                                                                Email:
                                                            </Typography>
                                                        </Grid> : <div/>
                                                }
                                                {
                                                    isEmailAuth() ?
                                                        <Grid item xs={6}>
                                                            <Typography variant="h6">
                                                                {user.email}
                                                            </Typography>
                                                        </Grid> : <div/>
                                                }
                                                <Grid item xs={6}>
                                                    <Typography variant="h6">
                                                        Phone Number:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="h6">
                                                        {user.phoneNumber.toString()}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>
                            <Grid item lg={6} md={12}>
                                <Paper variant="outlined">
                                    <Stack spacing={1} divider={<Divider/>} padding={1}>
                                        <Typography variant="h5">
                                            Bank Details
                                        </Typography>
                                        <Box>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Typography variant="h6">
                                                        A/C No:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="h6">
                                                        {user.bankAccountNumber}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="h6">
                                                        IFSC Code:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="h6">
                                                        {user.ifscCode}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="h6">
                                                        Banking ID:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="h6">
                                                        {user.razorpayContact}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper variant="outlined">
                                    <Stack spacing={1} divider={<Divider/>} padding={1}>
                                        <Typography variant="h5">
                                            Office Details
                                        </Typography>
                                        <Box>
                                            <Grid container spacing={1}>
                                                <Grid item xs={3}>
                                                    <Typography variant="h6">
                                                        Salary:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography variant="h6">
                                                        {`₹ ${user.salary}`}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography variant="h6">
                                                        Role:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography variant="h6">
                                                        {user.role}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography variant="h6">
                                                        Sign-in method:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography variant="h6">
                                                        {user.authMethod}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Typography variant="h6">
                                                        User ID:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography variant="h6">
                                                        {user.id}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Stack>
            </Paper>
        </Container>
    </HeaderComponent>
}

export default UserProfilePage