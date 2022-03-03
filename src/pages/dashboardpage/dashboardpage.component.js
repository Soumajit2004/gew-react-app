import React, {useEffect, useState} from "react";
import HeaderComponent from "../../components/header/header.component";
import {Container, Divider, Stack, Typography} from "@mui/material";
import {connect} from "react-redux";
import {selectCurrentUser} from "../../redux/user/user.selector";
import {db} from "../../firebase/firebase.utils";
import {query, collection, orderBy, limit, getDocs} from "firebase/firestore";
import {setRecentPo} from "../../redux/po/po.actions.";
import RecentPo from "../../components/recentPo/recentPo.component";
import withSpinner from "../../components/withSpinner/withSpinner.component";
import {showMessage} from "../../redux/snackbar/snackbar.actions";

const RecentPoWithSpinner = withSpinner(RecentPo)

const DashboardPage = ({setRecentPo, currentUser:{name}}, showMessage) => {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPo =  async () => {
            try{
                const data = await getDocs(query(collection(db, "po"), orderBy("lastEditedTime", "desc"), limit(12)))
                setRecentPo(data)
                setLoading(false)
            }catch (e) {
                showMessage(e.message)
                setLoading(false)
            }
        }
        fetchPo()
    }, [])

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

const mapStateToProps = (state) => ({
    currentUser: selectCurrentUser(state),
})

const mapDispatchToProps = dispatch => ({
    setRecentPo: docList => dispatch(setRecentPo(docList)),
    showMessage: message => dispatch(showMessage(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)