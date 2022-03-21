import React from "react";
import {
    Box,
    Button,
    Card,
    CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Divider,
    Grid,
    Grow,
    Menu,
    MenuItem,
    Paper,
    Stack,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {
    Edit,
    MenuOutlined,
} from "@mui/icons-material";
import {DataGrid} from "@mui/x-data-grid";
import {parseDate} from "../../utilils/functions.utilis";
import {useDispatch, useSelector} from "react-redux";
import {selectIsPoFetching, selectPoData} from "../../redux/po/po.selectors.";
import {deletePo, downloadPo, setEditMode,} from "../../redux/po/po.actions.";
import LoadingSpinner from "../withSpinner/isLoadingSpinner";
import PoSearch from "../po-search/poSearch.component";

const columns = [
    {field: 'id', headerName: 'ID', width: 50},
    {field: 'matName', headerName: 'Material Name', width: 250},
    {field: 'quantity', headerName: 'Quantity', width: 100, type: "number"},
    {field: 'unit', headerName: 'Unit', width: 90},
];

const PoViewBody = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [detailsOpen, setDetailsOpen] = React.useState(false);

    const {
        poNumber,
        material,
        issueNo,
        issueDate,
        poDate,
        description,
        lastEditedBy,
        lastEditedTime
    } = useSelector(selectPoData)
    const isFetching = useSelector(selectIsPoFetching)

    const dispatch = useDispatch()

    const open = Boolean(anchorEl);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleClickOpen = () => {
        setDetailsOpen(true);
    };
    const handleDetailsClose = () => {
        setDetailsOpen(false);
    };

    const getRows = () => {
        let r = []
        let counter = 0
        for (let key in material) {
            counter++
            r.push({
                id: counter, matName: key, quantity: material[key][0], unit: material[key][1]
            })
        }
        return r
    }
    const rows = getRows()

    return <Stack spacing={2}>
        <Dialog
            open={detailsOpen}
            onClose={handleDetailsClose}
        >
            <DialogTitle>
                Other Details
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Typography>{`Last modified by : ${lastEditedBy}`}</Typography>
                    <Typography>{`Last modified on : ${parseDate({date: lastEditedTime})}`}</Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDetailsClose} autoFocus>
                    Okay
                </Button>
            </DialogActions>
        </Dialog>
        <PoSearch/>
        <Divider/>
        {
            isFetching ? <LoadingSpinner/> : <Grow in>
                <Paper elevation={6} style={{overflowY: "scroll"}}>
                    <Box>
                        <Stack spacing={0}>
                            <Stack direction="row"
                                   style={{height: "60px", justifyContent: "space-between", padding: "0px 20px"}}>
                                <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <Typography variant="h6" style={{verticalAlign: "middle"}}>
                                        Search Results
                                    </Typography>
                                </div>
                                <div style={{display: "flex", alignItems: "center", gap: "20px"}}>
                                    <Button variant="contained" startIcon={<Edit/>} style={{height: 40}}
                                            onClick={() => {
                                                dispatch(setEditMode(true))
                                            }}>
                                        Edit
                                    </Button>
                                    <div>
                                        <IconButton
                                            id="basic-button"
                                            aria-controls={open ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={handleMenuClick}
                                        >
                                            <MenuOutlined/>
                                        </IconButton>
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem
                                                onClick={() => {
                                                    handleMenuClose()
                                                    dispatch(deletePo())
                                                }}>Delete</MenuItem>

                                            <MenuItem onClick={() => {
                                                dispatch(downloadPo())
                                                handleMenuClose()
                                            }}>
                                                Download
                                            </MenuItem>

                                            <MenuItem
                                                onClick={() => {
                                                    handleClickOpen()
                                                    handleMenuClose()
                                                }}>Details</MenuItem>
                                        </Menu>
                                    </div>
                                </div>
                            </Stack>
                            <Divider/>
                            <Box style={{height: "780px"}}>
                                <Grid container style={{padding: "20px"}} spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="p">P.O Number</Typography>
                                                <Typography variant="h6">{poNumber}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="p">Memo Number</Typography>
                                                <Typography variant="h6">{issueNo}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="p">P.O Date</Typography>
                                                <Typography variant="h6">{parseDate({
                                                    date: poDate,
                                                    reverse: false
                                                })}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="p">Memo Date</Typography>
                                                <Typography variant="h6">{parseDate({
                                                    date: issueDate,
                                                    reverse: false
                                                })}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="p">Materials</Typography>
                                                <div style={{height: "430px", width: '100%'}}>
                                                    <DataGrid
                                                        rows={rows}
                                                        columns={columns}
                                                        pageSize={6}
                                                        rowsPerPageOptions={[6]}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Card variant="outlined">
                                            <CardContent style={{height: "495px"}}>
                                                <Typography variant="p">Description</Typography>
                                                <Typography variant="h6">{description}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Stack>
                    </Box>
                </Paper>
            </Grow>
        }

    </Stack>
}

export default PoViewBody