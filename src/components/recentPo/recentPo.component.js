import React from "react";
import {Card, CardContent, Grid, Grow, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {selectPoView, selectRecentPo} from "../../redux/po/po.selectors.";
import {connect} from "react-redux";
import "./recentPo.styles.scss"
import {parseDate} from "../../utilils/functions.utilis";
import {withRouter} from "react-router";
import {setPoData, setSearchText, toggleViewMode} from "../../redux/po/po.actions.";

const RecentPo = ({recentPo: {docs}, setPoData, toggleViewMode, history, setSearchText, viewMode}) => {

    const handleClick = (element) => {
        setSearchText(element.id)
        setPoData({poNumber: element.id, ...element.data()})
        !viewMode ? toggleViewMode() : console.log("HI")

        history.push("/po-manager")
    }

    const getItems = () => {
        try {
            return docs.map((e) => {
                return (
                    <Grid key={e.id} item xs={12} lg={3} md={4}>
                        <Grow in>
                            <Card elevation={6} className="r-po-card" onClick={() => {
                                handleClick(e)
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
    viewMode: selectPoView(state)
})

const mapDispatchToProps = dispatch => ({
    setSearchText: text => dispatch(setSearchText(text)),
    toggleViewMode: () => dispatch(toggleViewMode()),
    setPoData: data => dispatch(setPoData(data))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RecentPo))