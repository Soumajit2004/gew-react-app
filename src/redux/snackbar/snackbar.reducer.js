import {SnackbarActionTypes} from "./snackbar.types";

const INITIAL_STATE = {
    open: false,
    message: ""
}

const snackbarReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SnackbarActionTypes.SHOW_MESSAGE:
            return {
                ...state,
                open: true,
                message: action.payload
            }
        case SnackbarActionTypes.CLOSE_SNACKBAR:
            return {
                ...state,
                open: false,
                message: ""
            }
        default:
            return state
    }
}

export default snackbarReducer