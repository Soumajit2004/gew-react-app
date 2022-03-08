import React from "react";
import {
    Box,
    Button,
    Card,
    CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Divider,
    Fade,
    Grid,
    Grow,
    Menu,
    MenuItem,
    Paper,
    Stack,
    TextField
} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {doc, deleteDoc} from "firebase/firestore";
import {ref, getDownloadURL} from "firebase/storage";
import {
    Add,
    Edit,
    MenuOutlined,
    Search
} from "@mui/icons-material";

import {DataGrid} from "@mui/x-data-grid";
import {downloadFromUrl, parseDate} from "../../utilils/functions.utilis";
import {connect} from "react-redux";
import {db, doxPoFirebaseFnc, storage} from "../../firebase/firebase.utils";
import {selectPoData, selectPoSearch} from "../../redux/po/po.selectors.";
import {deletePo, downloadPo, fetchPo, setAddMode, setEditMode, setSearchText} from "../../redux/po/po.actions.";
import LoadingSpinner from "../withSpinner/isLoadingSpinner";

const columns = [
    {field: 'id', headerName: 'ID', width: 50},
    {field: 'matName', headerName: 'Material Name', width: 250},
    {field: 'quantity', headerName: 'Quantity', width: 100, type: "number"},
    {field: 'unit', headerName: 'Unit', width: 90},
];

const PoViewBody = ({
                        poData: {
                            poNumber,
                            material,
                            issueNo,
                            issueDate,
                            poDate,
                            description,
                            lastEditedBy,
                            lastEditedTime
                        },
                        searchText,
                        setSearchText,
                        setEditMode,
                        fetchPo,
    setAddMode,
                        downloadPo,
                        deletePo,
                        isFetching
                    }) => {
    const rows = []
    let counter = 0

    //////////////

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    ///////////////

    const [detailsOpen, setDetailsOpen] = React.useState(false);

    const handleClickOpen = () => {
        setDetailsOpen(true);
    };

    const handleDetailsClose = () => {
        setDetailsOpen(false);
    };

    ////////////////

    for (let key in material) {
        counter++
        rows.push({
            id: counter, matName: key, quantity: material[key][0], unit: material[key][1]
        })
    }

    return <Stack spacing={2}>
        <Fade in>
            <Stack direction="row" spacing={2}>

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

                <TextField
                    hiddenLabel
                    id="filled-hidden-label-normal"
                    placeholder="Search P.O"
                    value={searchText}
                    variant="filled"
                    fullWidth={true}
                    onChange={(e) => {
                        setSearchText(e.target.value)
                    }}
                />
                <Button variant="contained" onClick={fetchPo}>
                    <Search/>
                </Button>
                <Button variant="contained" onClick={() => {
                    setAddMode(true)
                }}>
                    <Add/>
                </Button>
            </Stack>
        </Fade>
        <Divider/>
        <Grow in>
            {
                isFetching ? <LoadingSpinner/> : <Paper elevation={6} style={{overflowY: "scroll"}}>
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
                                                setEditMode(true)
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
                                                onClick={async () => {
                                                    handleMenuClose()
                                                    deletePo()
                                                }}>Delete</MenuItem>

                                            <MenuItem onClick={() => {
                                                downloadPo()
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
            }
        </Grow>
    </Stack>
}

const mapStateToProps = (state) => ({
    poData: selectPoData(state),
    searchText: selectPoSearch(state),
})

const mapDispatchToProps = dispatch => ({
    fetchPo: () => dispatch(fetchPo()),
    downloadPo: () => dispatch(downloadPo()),
    deletePo: () => dispatch(deletePo()),
    setSearchText: text => dispatch(setSearchText(text)),
    setEditMode: bool => dispatch(setEditMode(bool)),
    setAddMode: bool => dispatch(setAddMode(bool))
})

export default connect(mapStateToProps, mapDispatchToProps)(PoViewBody)