import {DataGrid} from "@mui/x-data-grid";
import {setPayoutRows} from "../../redux/payout/payout.actions";
import {Paper} from "@mui/material";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectIsUsersFetching, selectUsersRows} from "../../redux/user/user.selector";
import LoadingSpinner from "../withSpinner/isLoadingSpinner";
import Box from "@mui/material/Box";
import {selectSelectedPayouts} from "../../redux/payout/payout.selectors";

const PayoutTable = () => {
    const columns = [
        {field: 'name', headerName: 'Name', width: 250},
        {field: 'bankAccountNumber', headerName: 'Account No', width: 250},
        {field: 'salary', headerName: 'Salary', width: 150},
        {field: 'lastPayedDate', headerName: 'Last Payed On', width: 400},
    ];

    const userRows = useSelector(selectUsersRows)
    const isFetching = useSelector(selectIsUsersFetching)
    const selection = useSelector(selectSelectedPayouts)

    const dispatch = useDispatch()

    return <Box style={{height: "100%"}}>
        {isFetching ? <LoadingSpinner/> :
            <Paper elevation={6} style={{height: "100%"}}>
                <DataGrid
                    rows={userRows}
                    columns={columns}
                    checkboxSelection
                    disableSelectionOnClick
                    selectionModel={selection}
                    onSelectionModelChange={(newSelection) => {
                        dispatch(setPayoutRows(newSelection))
                    }}
                />
            </Paper>
        }
    </Box>
}

export default PayoutTable