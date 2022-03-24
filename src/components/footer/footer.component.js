import {Grid, Link} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";

const Footer = () => {
    return <Box className="footer">
        <Grid container padding={1} rowSpacing={2}>
            <Grid item xs={4} className="center">
                <Link
                    href="https://www.termsandconditionsgenerator.com/live.php?token=DTsocEPqE4tRFu3dm4eD3lAM1V0HGgrx"
                >Terms & Conditions</Link>
            </Grid>
            <Grid item xs={4} className="center">
                <Link
                    href={"https://www.privacypolicygenerator.info/live.php?token=SygGKLWW9a7fSD1wSjgtIHHsfMrL0U46"}
                >Privacy Policy</Link>
            </Grid>
            <Grid item xs={4} className="center">
                <Link
                    href={"https://www.privacypolicies.com/live/1638f490-d93e-45e8-9cc8-5f5a10861048"}
                >Refund Policy</Link>
            </Grid>
        </Grid>
    </Box>
}

export default Footer