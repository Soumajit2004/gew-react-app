import React, {useEffect, useState} from "react";
import {doc, updateDoc} from "firebase/firestore";
import {db, payUserFnc} from "../../firebase/firebase.utils";
import {DataGrid} from "@mui/x-data-grid";
import LoadingSpinner from "../withSpinner/isLoadingSpinner";
import {showMessage} from "../../redux/snackbar/snackbar.actions";
import {
    Button,
    Container,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fade,
    Stack,
    Typography
} from "@mui/material";
import {connect} from "react-redux";
import Divider from "@mui/material/Divider";
import {Edit, RefreshOutlined} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import {fetchUsers} from "../../redux/user/user.actions";
import {selectIsUsersFetching, selectUsersRows} from "../../redux/user/user.selector";


const PayoutMain = ({showMessage, fetchUsers, isFetching, userRows}) => {
    const [selections, setSelections] = useState([])
    const [confDialog, setConfDialog] = useState(false)
    const columns = [
        {field: 'name', headerName: 'Name', width: 250},
        {field: 'bankAccountNumber', headerName: 'Account No', width: 250},
        {field: 'salary', headerName: 'Salary', width: 150},
        {field: 'lastPayedDate', headerName: 'Last Payed On', width: 320},
        {
            field: "edit", headerName: 'Edit Salary', width: 100, align: "center",
            headerAlign: "center", hideable: false, sortable: false, filterable: false,
            renderCell: (cellValues) => {
                return (
                    <IconButton color="primary"
                                onClick={
                                    async () => {
                                        await handleSalaryEdit(cellValues.row.id)
                                    }
                                }>
                        <Edit/>
                    </IconButton>
                );
            }
        }
    ];

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleSalaryEdit = async (id) => {
        try {
            const newSalary = parseInt(window.prompt("Enter new salary: "));

            if (newSalary) {
                await updateDoc(doc(db, "users", id), {
                    salary: newSalary
                });

                showMessage("Salary updated !")
            } else {
                showMessage("Enter some value")
            }
        } catch (e) {
            showMessage("Failed to update salary")
        }
    }

    const handlePay = async () => {
        if (selections.length > 0) {
            for (let e of selections) {
                try {
                    showMessage(`Paying...`)
                    await payUserFnc({id: e.toString()})
                    showMessage(`Payed successfully`)
                } catch (er) {
                    showMessage(er.message)
                }
            }
        }
    }

    const PaymentConformationDialog = () => {
        let totalAmount = 0
        let recentlyPaidNames = []
        if (confDialog) {
            for (let e in selections) {
                for (let i in userRows) {
                    i = userRows[i]
                    if (i.id === selections[e]) {
                        totalAmount += parseInt(i.salary)

                        if (i.lastPayedDate) {
                            let diff = Math.abs(new Date() - new Date(i.lastPayedDate))
                            diff = diff / (1000 * 3600 * 24)

                            diff < 28 ? recentlyPaidNames.push(i.name) : console.log("ok")
                        }
                    }
                }
            }
        }

        return <Dialog
            open={confDialog}
            onClose={() => {
                setConfDialog(false)
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Payment Conformation
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {`${selections.length} users selected, total payable amount ₹${totalAmount}. \n
                    ${recentlyPaidNames.length > 0 ? `${recentlyPaidNames.toString()} was paid less than 28 days ago. Do you want to pay them again?` : "."}`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    setConfDialog(false)
                }}>Cancel</Button>
                <Button onClick={async () => {
                    setConfDialog(false)
                    await handlePay()
                }} autoFocus>
                    Pay
                </Button>
            </DialogActions>
        </Dialog>
    }

    return <Container style={{height: "80vh"}}>
        <PaymentConformationDialog/>
        {
            isFetching ? <LoadingSpinner/> :
                (<Fade in>
                    <Stack height="100%" spacing={2}>
                        <Stack spacing={1}>
                            <Stack direction="row" style={{justifyContent: "space-between", alignItems: "center"}}>
                                <Typography
                                    variant="h5">{selections.length > 0 ? `${selections.length} User Selected` : "Select users to pay"}</Typography>
                                <Stack direction="row" spacing={2}>
                                    <Button variant="contained" onClick={() => {
                                        setConfDialog(true)
                                    }}
                                            disabled={selections.length === 0}>Pay Salary</Button>
                                    <Button variant="outlined" onClick={fetchUsers}>
                                        <RefreshOutlined/>
                                    </Button>
                                </Stack>
                            </Stack>
                            <Divider/>
                        </Stack>
                        <DataGrid
                            rows={userRows}
                            columns={columns}
                            checkboxSelection
                            disableSelectionOnClick
                            onSelectionModelChange={(newSelection) => {
                                setSelections(newSelection)
                            }}
                        />
                    </Stack>
                </Fade>)
        }
    </Container>


}

const mapStateToProps = state => ({
    isFetching: selectIsUsersFetching(state),
    userRows: selectUsersRows(state)
})


const mapDispatchToProp = dispatch => ({
    showMessage: message => dispatch(showMessage(message)),
    fetchUsers: () => dispatch(fetchUsers()),
})

export default connect(mapStateToProps, mapDispatchToProp)(PayoutMain)