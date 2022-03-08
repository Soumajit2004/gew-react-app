import React, {useEffect} from "react";
import {Card, CardContent, Grid, Grow, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {connect} from "react-redux";
import "./recentPo.styles.scss"
import {parseDate} from "../../utilils/functions.utilis";
import {withRouter} from "react-router";
import {fetchPo, setSearchText} from "../../redux/po/po.actions.";
import {selectRecentPo} from "../../redux/recentPo/recentPo.selectors";
import {fetchRecentPo} from "../../redux/recentPo/recentPo.actions";

const RecentPo = ({recentPo: {docs}, fetchRecentPo, setSearchText, fetchPo, history}) => {

    useEffect(() => {
        fetchRecentPo()
    }, [])


    const getItems = () => {
        try {
            return docs.map((e) => {
                return (
                    <Grid key={e.id} item xs={12} lg={3} md={4}>
                        <Grow in>
                            <Card elevation={6} className="r-po-card" onClick={() => {
                                setSearchText(e.id)
                                fetchPo()
                                history.push("/po-manager")
                            }}>
                                <CardContent>
                                    <Typography variant="h5" fontWeight={500} gutterBottom>
                                        {e.id}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {parseDate({date: e.data().lastEditedTime.toDate()})}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grow>
                    </Grid>
                )
            })
        } catch (e) {
            return (
                <Grid item xs={12} lg={3} md={6}>
                    <Typography variant="h5" fontWeight={500} gutterBottom>
                        Loading...
                    </Typography>
                </Grid>
            )

        }

    }

    return (
        <Stack spacing={2}>
            <Typography variant="h5" fontWeight={300}>Recent P.Os</Typography>
            <Box>
                <Grid container spacing={3}>
                    {getItems()}
                </Grid>
            </Box>
        </Stack>
    )
}

const mapStateToProps = (state) => ({
    recentPo: selectRecentPo(state),
})

const mapDispatchToProps = dispatch => ({
    setSearchText: text => dispatch(setSearchText(text)),
    fetchRecentPo: () => dispatch(fetchRecentPo()),
    fetchPo: () => dispatch(fetchPo())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RecentPo))