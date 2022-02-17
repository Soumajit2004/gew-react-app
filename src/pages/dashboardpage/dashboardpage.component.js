import React from "react";
import HeaderComponent from "../../components/header/header.component";
import {Container, Divider, Stack, Typography} from "@mui/material";
import {connect} from "react-redux";
import {selectCurrentUser} from "../../redux/user/user.selector";
import {db} from "../../firebase/firebase.utils";
import {query, collection, orderBy, limit, getDocs} from "firebase/firestore";
import {setRecentPo} from "../../redux/po/po.actions.";
import RecentPo from "../../components/recentPo/recentPo.component";
import withSpinner from "../../components/withSpinner/withSpinner.component";

const RecentPoWithSpinner = withSpinner(RecentPo)

class DashboardPage extends React.Component {

    state = {
        loading: true
    }

    componentDidMount() {
        const {setRecentPo} = this.props

        const q = query(collection(db, "po"), orderBy("lastEditedTime", "desc"), limit(12))
        getDocs(q)
            .then(r => {
                setRecentPo(r)
                this.stopLoading()
            })
            .catch(e => {
                this.stopLoading()
            })
    }

    stopLoading = () => {this.setState({loading:false})}

    // eslint-disable-next-line react/require-render-return
    render() {
        const {currentUser: {name}} = this.props
        const {loading} = this.state

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
                        <RecentPoWithSpinner isLoading={loading}/>
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