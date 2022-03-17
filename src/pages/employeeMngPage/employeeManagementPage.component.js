import React, {useEffect, useState} from "react"
import HeaderComponent from "../../components/header/header.component";
import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Divider, InputAdornment, Stack,
    TextField
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {useDispatch, useSelector} from "react-redux";
import {selectIsUsersFetching, selectUsersRows} from "../../redux/user/user.selector";
import {CurrencyRupee} from "@mui/icons-material";
import {showMessage} from "../../redux/snackbar/snackbar.actions";
import {fetchUsers} from "../../redux/user/user.actions";
import Box from "@mui/material/Box";
import {doc, setDoc} from "firebase/firestore";
import {db, deleteUserFnc} from "../../firebase/firebase.utils";
import IsLoadingSpinner from "../../components/withSpinner/isLoadingSpinner";
import Typography from "@mui/material/Typography";

const UserManagementPage = () => {
    const [selectedElement, setSelectedElement] = useState({})
    const [isDialogOpen, setDialogOpen] = useState(false)

    const userRows = useSelector(selectUsersRows)
    const columns = [
        {field: 'name', headerName: 'Name', width: 250},
        {field: 'bankAccountNumber', headerName: 'Account No', width: 250},
        {field: 'salary', headerName: 'Salary', width: 100},
        {field: 'phoneNumber', headerName: 'Phone Number', width: 150},
        {field: 'lastPayedDate', headerName: 'Last Payed', width: 400},
    ];

    const isFetching = useSelector(selectIsUsersFetching)

    const dispatch = useDispatch()
    const showMessageHandler = (msg, mode) => dispatch(showMessage(msg, mode))
    const fetchUsersHandler = () => dispatch(fetchUsers())

    useEffect(() => {
        fetchUsersHandler()
    }, [dispatch])

    const EditDisplayDialog = ({element}) => {
        const data = element.row

        const handleEmployeeSave = async (event) => {
            event.preventDefault()
            setDialogOpen(false)

            const formData = new FormData(event.target)
            try {
                await setDoc(doc(db, "users", data.id), {
                    salary: formData.get("salary")
                }, {merge: true})
                showMessageHandler("Employee details updated", "success")
                fetchUsersHandler()
            } catch (e) {
                showMessageHandler(e.message, "error")
            }
        }

        return <Dialog
            open={isDialogOpen}
            onClose={() => {
                setDialogOpen(false)
            }}
        >
            <Box component="form" onSubmit={handleEmployeeSave}>
                <DialogTitle id="alert-dialog-title">
                    Edit Salary
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To edit employee salary change the value and click save.
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        name="salary"
                        type="number"
                        required
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><CurrencyRupee/></InputAdornment>,
                        }}
                        label="Salary"
                        defaultValue={data ? data.salary : 0}
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={async () => {
                        await deleteUserFnc(data)
                        setDialogOpen(false)
                        showMessageHandler("User Deleted", "success")
                    }}>Delete</Button>
                    <Button onClick={() => {
                        setDialogOpen(false)
                    }}>Cancel</Button>
                    <Button type="submit">
                        Save
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    }

    return <HeaderComponent title="Employees">
        <Container>
            <EditDisplayDialog element={selectedElement}/>
            <Stack marginTop={0.5} spacing={2} style={{height: "90vh"}} divider={<Divider/>}>
                <Typography variant="h5">Employee Manager</Typography>
                {
                    !isFetching ? <DataGrid
                        rows={userRows}
                        columns={columns}
                        onCellDoubleClick={(element) => {
                            setSelectedElement(element)
                            setDialogOpen(true)
                        }}
                    /> : <IsLoadingSpinner/>
                }
            </Stack>
        </Container>
    </HeaderComponent>
}

export default UserManagementPage