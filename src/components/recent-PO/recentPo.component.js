import React, {useEffect} from "react";
import {Card, CardContent, Grid, Grow, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {connect} from "react-redux";
import "./recentPo.styles.scss"
import {parseDate} from "../../utilils/functions.utilis";
import {withRouter} from "react-router";
import {fetchPo, setSearchText} from "../../redux/po/po.actions.";
import {selectRecentPo, selectRecentPoAll} from "../../redux/recentPo/recentPo.selectors";
import {fetchRecentPo, setRecentPoAll} from "../../redux/recentPo/recentPo.actions";
import {ArrowRightAltOutlined} from "@mui/icons-material";

const RecentPo = ({recentPo: {docs}, fetchRecentPo, setSearchText, fetchPo, history, setRecentPoAll, isViewAll}) => {

    useEffect(() => {
        fetchRecentPo()
    }, [])


    const getItems = () => {
        try {
            let items = []
            items.push(docs.map((e) => {
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
            }))

            if (!isViewAll) {
                items.push(
                    <Grid key="all" item xs={12} lg={3} md={4}>
                        <Grow in>
                            <Card elevation={6} className="r-po-card" onClick={() => {
                                setRecentPoAll(true)
                                fetchRecentPo()
                            }}>
                                <CardContent style={{
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <Typography variant="h5" fontWeight={400}>
                                        Show All
                                    </Typography>
                                    <ArrowRightAltOutlined fontSize="large"/>
                                </CardContent>
                            </Card>
                        </Grow>
                    </Grid>)
            }

            return items
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
    isViewAll: selectRecentPoAll(state)
})

const mapDispatchToProps = dispatch => ({
    setSearchText: text => dispatch(setSearchText(text)),
    setRecentPoAll: bool => dispatch(setRecentPoAll(bool)),
    fetchRecentPo: () => dispatch(fetchRecentPo()),
    fetchPo: () => dispatch(fetchPo())

})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RecentPo))