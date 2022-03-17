import {IconButton, Snackbar} from "@mui/material";
import React from "react";
import {Close} from "@mui/icons-material";
import {selectSnackbarMessage, selectSnackbarMode, selectSnackbarOpen} from "../../redux/snackbar/snackbar.selectors";
import {useDispatch, useSelector} from "react-redux";
import {closeSnackbar} from "../../redux/snackbar/snackbar.actions";
import {Alert} from "@mui/lab";

const CustomSnackBar = () => {
    const isSnackbarOpen = useSelector(selectSnackbarOpen)
    const snackbarMessage = useSelector(selectSnackbarMessage)
    const mode = useSelector(selectSnackbarMode)

    const dispatch = useDispatch()
    const closeSnackbarHandler = () => {
        dispatch(closeSnackbar())
    }

    const snackbarAction = (
        <IconButton color="secondary" onClick={closeSnackbarHandler}>
            <Close/>
        </IconButton>
    )

    const anchor = {vertical: "bottom", horizontal: "center"}

    return (
        <Snackbar open={isSnackbarOpen}
                  action={snackbarAction}
                  anchorOrigin={anchor}
                  autoHideDuration={3000}
                  onClose={closeSnackbarHandler}
        >
            <Alert onClose={closeSnackbarHandler} severity={mode} sx={{width: '100%'}}>
                {snackbarMessage.toString()}
            </Alert>
        </Snackbar>
    )
}

export default CustomSnackBar