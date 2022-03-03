import {IconButton, Snackbar} from "@mui/material";
import React from "react";
import {Close} from "@mui/icons-material";
import {selectSnackbarMessage, selectSnackbarOpen} from "../../redux/snackbar/snackbar.selectors";
import {connect} from "react-redux";
import {closeSnackbar} from "../../redux/snackbar/snackbar.actions";

const CustomSnackBar = ({isSnackbarOpen, snackbarMessage, closeSnackbar}) => {

    const snackbarAction = (
        <IconButton color="secondary" onClick={closeSnackbar}>
            <Close/>
        </IconButton>
    )

    return (
        <Snackbar open={isSnackbarOpen}
                  action={snackbarAction}
                  autoHideDuration={3000}
                  message={snackbarMessage}
                  onClose={closeSnackbar}
        />
    )
}

const mapStateToProps = (state) => ({
    isSnackbarOpen: selectSnackbarOpen(state),
    snackbarMessage: selectSnackbarMessage(state)
})

const mapDispatchToProp = dispatch => ({
    closeSnackbar: () => dispatch(closeSnackbar())
})

export default React.memo(connect(mapStateToProps, mapDispatchToProp)(CustomSnackBar))