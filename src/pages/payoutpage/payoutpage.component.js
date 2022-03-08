import HeaderComponent from "../../components/header/header.component";
import React, {useState} from "react";
import {Tab} from "@mui/material";
import Box from "@mui/material/Box";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import PayoutMain from "../../components/payout-main/payoutMain.component";
import PaymentHistory from "../../components/payment-history/paymentHistory.component";

const PayoutPage = () => {

    const [tabIndex, setTabIndex] = useState("1")

    return <HeaderComponent title="Payouts">
        <Box sx={{ width: '100%'}}>
            <TabContext value={tabIndex}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={(e, v)=>{setTabIndex(v)}} >
                        <Tab label="Payments" value="1" />
                        <Tab label="History" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <PayoutMain/>
                </TabPanel>
                <TabPanel value="2">
                    <PaymentHistory/>
                </TabPanel>
            </TabContext>
        </Box>
    </HeaderComponent>
}

export default PayoutPage