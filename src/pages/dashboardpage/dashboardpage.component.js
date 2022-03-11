import React from "react";
import HeaderComponent from "../../components/header/header.component";
import {Container, Divider, Stack, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/user/user.selector";
import RecentPo from "../../components/recent-PO/recentPo.component";

const DashboardPage = () => {
    const name = useSelector(selectCurrentUser).name

    return (
        <HeaderComponent title="Dashboard">
            <Container>
                <Stack spacing={2}>
                    <Typography variant="h3"
                                component="h3"
                                fontSize={35}
                                fontWeight={500}>
                        Welcome, {name} !
                    </Typography>
                    <Divider/>
                    <RecentPo/>
                </Stack>
            </Container>
        </HeaderComponent>
    )
}

export default DashboardPage