import React from "react";
import HeaderComponent from "../../components/header/header.component";
import {Container, Divider, Grid, Stack, Typography} from "@mui/material";
import {connect} from "react-redux";
import {selectCurrentUser} from "../../redux/user/user.selector";
import {db} from "../../firebase/firebase.utils";
import {query, collection, orderBy, limit, getDocs} from "firebase/firestore";
import {selectRecentPo} from "../../redux/po/po.selectors.";
import {setCurrentUser} from "../../redux/user/user.actions";
import {setRecentPo} from "../../redux/po/po.actions.";
import RecentPo from "../../components/recentPo/recentPo.component";

class DashboardPage extends React.Component {

    constructor(props) {
        super(props);

        this.query = query(collection(db, "po"), orderBy("lastEditedTime", "desc"), limit(10))
        const {setRecentPo} = this.props
        getDocs(this.query).then(r => {
            setRecentPo(r)
        })
    }


    // eslint-disable-next-line react/require-render-return
    render() {
        const {currentUser: {displayName}} = this.props

        return (
            <HeaderComponent title="Dashboard">
                <Container>
                    <Stack spacing={2}>
                        <Typography variant="h3"
                                    component="h3"
                                    fontSize={35}
                                    fontWeight={500}>
                            Welcome, {displayName} !
                        </Typography>
                        <Divider/>
                        <RecentPo/>
                    </Stack>
                </Container>
            </HeaderComponent>
        )
    }
}

const mapStateToProps = (state) => ({
    currentUser: selectCurrentUser(state),
})

const mapDispatchToProps = dispatch => ({
    setRecentPo: docList => dispatch(setRecentPo(docList))
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)