import HeaderComponent from "../../components/header/header.component";
import React, {useEffect, useState} from "react";
import {Tab} from "@mui/material";
import Box from "@mui/material/Box";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import PayoutMain from "../../components/payout/payoutMain.component";
import PaymentHistory from "../../components/payment-history/paymentHistory.component";
import CustomPayout from "../../components/payout/custom-payment.component";
import {useDispatch} from "react-redux";
import {fetchUsers} from "../../redux/user/user.actions";

const PayoutPage = () => {
    const [tabIndex, setTabIndex] = useState("1")

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    return <HeaderComponent title="Payouts">
        <Box sx={{width: '100%'}}>
            <TabContext value={tabIndex}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <TabList onChange={(e, v) => {
                        setTabIndex(v)
                    }}>
                        <Tab label="Payments" value="1"/>
                        <Tab label="Custom Payments" value="2"/>
                        <Tab label="History" value="3"/>
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <PayoutMain/>
                </TabPanel>
                <TabPanel value="2">
                    <CustomPayout/>
                </TabPanel>
                <TabPanel value="3">
                    <PaymentHistory/>
                </TabPanel>
            </TabContext>
        </Box>
    </HeaderComponent>
}

export default PayoutPage