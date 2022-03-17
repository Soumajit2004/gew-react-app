import {SnackbarActionTypes} from "./snackbar.types";

export const showMessage = (message, mode) => {
    return {
        type: SnackbarActionTypes.SHOW_MESSAGE,
        payload: message.toString(),
        mode: mode
    }
}

export const closeSnackbar = () => {
    return {
        type: SnackbarActionTypes.CLOSE_SNACKBAR,
    }
}