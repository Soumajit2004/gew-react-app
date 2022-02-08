import React from "react";
import HeaderComponent from "../../components/header/header.component";
import {Container, Typography} from "@mui/material";
import {connect} from "react-redux";
import {selectCurrentUser} from "../../redux/user/user.selector";
import {auth} from "../../firebase/firebase.utils";

class DashboardPage extends React.Component {

    // eslint-disable-next-line react/require-render-return
    render() {
        const {displayName} = this.props.currentUser

        return (
            <HeaderComponent title="Dashboard">
                <Container
                    children={
                        <Typography variant="h3"
                                    component="h3"
                                    fontWeight={600}>
                            Welcome, {displayName} !
                        </Typography>
                    }
                />
            </HeaderComponent>
        )
    }
}

const mapStateToProps = (state) => ({
    currentUser: selectCurrentUser(state)
})

export default connect(mapStateToProps)(DashboardPage)