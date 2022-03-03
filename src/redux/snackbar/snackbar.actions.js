import {SnackbarActionTypes} from "./snackbar.types";

export const showMessage = (message) => {
    return {
        type: SnackbarActionTypes.SHOW_MESSAGE,
        payload: message.toString()
    }
}

export const closeSnackbar = () => {
    return {
        type: SnackbarActionTypes.CLOSE_SNACKBAR,
    }
}