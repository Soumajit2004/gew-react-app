import React, {useEffect, useState} from "react";
import HeaderComponent from "../../components/header/header.component";
import {Container, Divider, Stack, Typography} from "@mui/material";
import {connect} from "react-redux";
import {selectCurrentUser} from "../../redux/user/user.selector";
import RecentPo from "../../components/recentPo/recentPo.component";

const DashboardPage = ({currentUser:{name}}) => {

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

const mapStateToProps = (state) => ({
    currentUser: selectCurrentUser(state),
})

export default connect(mapStateToProps, null)(DashboardPage)