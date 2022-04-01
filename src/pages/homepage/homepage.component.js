import React from "react";
import "./homepage.styles.scss";
import {
    Button,
    Container, Grid,
    Stack, TextField,
    Typography
} from "@mui/material";
import RazorpayButton from "../../components/razorpay-button/razorpayButton.component";
import Box from "@mui/material/Box";
import Footer from "../../components/footer/footer.component";

const HomePage = () => {

    return <Stack>
        <Box className={"welcome"}>
            <Container
                style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center"
                }}>
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
            </Container>
        </Box>
        <Box className={"contact"}>
            <Container style={{height: "100%"}}>
                <Box style={{height: "100%"}}>
                    <Grid container style={{height: "100%"}} spacing={4} paddingY={6}>
                        <Grid item xs={12}>
                            <Typography variant={"h2"} textAlign={"center"} fontWeight={600}>
                                Get in touch
                            </Typography>
                        </Grid>
                        <Grid item sm={12} md={6} xs={12} style={{minHeight:"50vh"}}>
                            <iframe
                                title={"Map"}
                                id={"mapBox"}
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d459.66060773917!2d88.1698592054715!3d22.82894810803874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x876b686319db9cdc!2sGhosh%20Electrical%20Work!5e0!3m2!1sen!2sin!4v1648136825300!5m2!1sen!2sin"
                                width="100%" height={"100%"}/>
                        </Grid>
                        <Grid item sm={12} md={6} xs={12}>
                            <Box component={"form"} action={"https://formspree.io/f/mzboapzl"} method={"POST"} className={"contact-form"}>
                                <Stack spacing={2} paddingY={3} paddingX={2}>
                                    <Typography variant="h3" fontWeight={500} textAlign={"center"} color={"primary"}>
                                        Contact
                                    </Typography>
                                    <TextField name={"Name"} label="Name" variant="filled" fullWidth required/>
                                    <TextField name={"phNo"} label="Phone No" variant="filled" required type={"number"}  fullWidth/>
                                    <TextField name={"email"} label="Email" variant="filled" type={"email"} fullWidth/>
                                    <TextField name={"message"} label="Message" rows={12} variant="filled" multiline fullWidth required/>
                                    <div className={"center"}>
                                        <Button type={"submit"} variant="contained" style={{width: "150px", height:"60px"}}>
                                            Submit
                                        </Button>
                                    </div>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
        <Footer/>
    </Stack>
}

export default HomePage