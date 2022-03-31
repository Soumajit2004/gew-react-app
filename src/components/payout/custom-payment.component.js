import React, {useState} from "react";
import {CurrencyRupee, RefreshOutlined} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {selectUsersRows} from "../../redux/user/user.selector";
import {fetchUsers} from "../../redux/user/user.actions";
import {
    Button,
    CircularProgress, Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Fade, InputAdornment,
    Stack, TextField, Typography
} from "@mui/material";
import Divider from "@mui/material/Divider";
import {payUsers} from "../../redux/payout/payout.actions";
import PayoutTable from "./payoutTable.component";
import {selectIsPaying, selectSelectedPayouts} from "../../redux/payout/payout.selectors";

const CustomPayout = () => {
    const [amount, setAmount] = useState(0)
    const [confDialog, setConfDialog] = useState(false)

    const isPaying = useSelector(selectIsPaying)
    const userRows = useSelector(selectUsersRows)
    const selections = useSelector(selectSelectedPayouts)

    const dispatch = useDispatch()
    const fetchUsersHandler = () => dispatch(fetchUsers())


    const PaymentConformationDialog = () => {
        let totalAmount = 0
        let recentlyPaidNames = []
        if (confDialog) {
            for (let e in selections) {
                for (let i in userRows) {
                    i = userRows[i]
                    if (i.id === selections[e]) {
                        totalAmount += parseInt(amount)
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
                    dispatch(payUsers({mode: "custom", amount: amount}))
                }} autoFocus>
                    Pay
                </Button>
            </DialogActions>
        </Dialog>
    }

    const PayingDialog = () => {
        return <Dialog
            open={isPaying}
            maxWidth={"xs"}
            fullWidth={true}
        >
            <DialogContent>
                <Stack spacing={3} style={{justifyContent: "center", alignItems: "center"}}>
                    <CircularProgress size={60}/>
                    <Typography variant="h4" fontWeight={500}>
                        Paying
                    </Typography>
                    <Typography>
                        This may take some time, don't close the window
                    </Typography>
                </Stack>
            </DialogContent>
        </Dialog>
    }

    return <Container style={{height: "80vh"}}>
        <PaymentConformationDialog/>
        <PayingDialog/>
        <Fade in>
            <Stack height="100%" spacing={2} divider={<Divider/>}>
                <Stack spacing={1}>
                    <Stack direction="row" style={{justifyContent: "space-between", alignItems: "center"}}>
                        <TextField label="Enter Amount" variant="filled" type="number"
                                   size="small"
                                   InputProps={{
                                       startAdornment: <InputAdornment position="start"><CurrencyRupee/></InputAdornment>,
                                   }}
                                   onChange={(e) => {
                                       setAmount(e.target.value)
                                   }}
                        />
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" onClick={() => {
                                setConfDialog(true)
                            }}
                                    disabled={selections.length < 1 || amount < 1}>Pay</Button>
                            <Button variant="outlined" onClick={fetchUsersHandler}>
                                <RefreshOutlined/>
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
                <PayoutTable/>
            </Stack>
        </Fade>
    </Container>
}

export default CustomPayout