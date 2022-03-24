import React from "react";
import "./homepage.styles.scss";
import {
    Button,
    Container, Grid,
    Stack, TextField,
    Typography
} from "@mui/material";
import RazorpayButton from "../../components/razorpay-button/razorpayButton.component";
import VisitorHeader from "../../components/appbarVisitor/appbarVsitor.component";
import Box from "@mui/material/Box";
import {MapContainer} from "../../components/mapBox/map.component";

const HomePage = () => {

    return <VisitorHeader>
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
                        <Grid item sm={0} md={6} xs={0}>
                            <MapContainer/>
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
        <Container>

        </Container>
    </VisitorHeader>
}

export default HomePage