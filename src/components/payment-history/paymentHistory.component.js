import {Button, Container, Paper, Stack, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {useEffect} from "react";
import {fetchPaymentHistory} from "../../redux/payout/payout.actions";
import {dateToUnix, parseDate} from "../../utilils/functions.utilis";
import {useDispatch, useSelector} from "react-redux";
import Box from "@mui/material/Box";
import {Search} from "@mui/icons-material";
import {selectIsPaymentHistoryFetching, selectPaymentHistory} from "../../redux/payout/payout.selectors";
import {DataGrid} from "@mui/x-data-grid";
import IsLoadingSpinner from "../withSpinner/isLoadingSpinner";

const PaymentHistory = () => {
    const columns = [
        {field: 'name', headerName: 'Name', width: 250},
        {field: 'rAmount', headerName: 'Amount', width: 200},
        {field: 'status', headerName: 'Status', width: 150},
        {
            field: 'created_at', headerName: 'Payed On', width: 250,
            renderCell: (params) => {
                return <Typography>
                    {new Date(params.value * 1000).toDateString()}
                </Typography>
            }
        },
        {field: 'id', headerName: 'Payment ID', width: 250},

    ];
    const today = parseDate({date: new Date(), reverse: true})

    const rows = useSelector(selectPaymentHistory)
    const isFetching = useSelector(selectIsPaymentHistoryFetching)
    const dispatch = useDispatch()

    useEffect(() => {
        const mFunction  = () => {
            dispatch(fetchPaymentHistory({startUnixTime: dateToUnix(new Date()), endUnixTime: dateToUnix(new Date())}))
        }
        mFunction()
    }, [dispatch])

    const handleSubmit = (event) => {
        event.preventDefault()

        const data = new FormData(event.currentTarget)
        const start = data.get("start")
        const end = data.get("end")

        const q = {
            startUnixTime: dateToUnix(new Date(start)),
            endUnixTime: dateToUnix(new Date(end))
        }
        dispatch(fetchPaymentHistory(q))
    }

    return <Container>
        <Stack spacing={2} divider={<Divider/>}>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography variant={"h5"}>
                    Select Date Range
                </Typography>
                <Box component={"form"}
                     onSubmit={handleSubmit}
                     style={{
                         display: "flex",
                         flexDirection: "row",
                         gap: "10px"
                     }}>
                    <TextField label="From" name={"start"} variant="outlined" type={"date"} size={"small"}
                               defaultValue={today}/>
                    <Typography color={"primary"} variant={"h4"}>{" - "}</Typography>
                    <TextField label="To" name={"end"} variant="outlined" type={"date"} size={"small"}
                               defaultValue={today}/>
                    <Button type={"submit"} startIcon={<Search/>} variant={"contained"} style={{height: "40px"}}>
                        Search
                    </Button>
                </Box>
            </Stack>
            <Paper style={{height: "80vh"}} elevation={6}>
                {
                    isFetching ? <IsLoadingSpinner/> : <DataGrid
                        rows={rows}
                        columns={columns}
                    />
                }
            </Paper>
        </Stack>
    </Container>
}

export default PaymentHistory