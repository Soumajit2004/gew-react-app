import React, {useEffect} from "react";
import {Card, CardContent, Grid, Grow, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {useDispatch, useSelector} from "react-redux";
import "./recentPo.styles.scss"
import {parseDate} from "../../utilils/functions.utilis";
import {withRouter} from "react-router";
import {fetchPo} from "../../redux/po/po.actions.";
import {selectRecentPo, selectRecentPoAll} from "../../redux/recentPo/recentPo.selectors";
import {fetchRecentPo, setRecentPoAll} from "../../redux/recentPo/recentPo.actions";
import {ArrowRightAltOutlined} from "@mui/icons-material";

const RecentPo = ({history}) => {
    const docs = useSelector(selectRecentPo).docs
    const isViewAll = useSelector(selectRecentPoAll)

    const dispatch = useDispatch()
    const fetchRecentPoHandler = () => dispatch(fetchRecentPo())

    useEffect(() => {
        fetchRecentPoHandler()
    }, [dispatch])

    const getItems = () => {
        try {
            let items = []
            items.push(docs.map((e) => {
                return (
                    <Grid key={e.id} item xs={12} lg={3} md={4}>
                        <Grow in>
                            <Card elevation={6} className="r-po-card" onClick={() => {
                                dispatch(fetchPo(e.id))
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

            if (!isViewAll || items.length >= 11) {
                items.push(
                    <Grid key="all" item xs={12} lg={3} md={4}>
                        <Grow in>
                            <Card elevation={6}
                                  className="r-po-card"
                                  onClick={() => {
                                      dispatch(setRecentPoAll(true))
                                      fetchRecentPoHandler()
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
            return (<Grid item xs={12} lg={3} md={6}>
                <Typography variant="h5" fontWeight={500} gutterBottom>
                    Loading...
                </Typography>
            </Grid>)

        }

    }

    return (<Stack spacing={2}>
        <Typography variant="h5" fontWeight={300}>Recent P.Os</Typography>
        <Box>
            <Grid container spacing={3}>
                {getItems()}
            </Grid>
        </Box>
    </Stack>)
}

export default withRouter(RecentPo)