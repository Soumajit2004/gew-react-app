import {createSelector} from "reselect";

const selectSnackBar = state => state.snackbar

export const selectSnackbarOpen = createSelector(
    [selectSnackBar],
    snackbar => snackbar.open
)

export const selectSnackbarMessage = createSelector(
    [selectSnackBar],
    snackbar => snackbar.message
)

export const selectSnackbarMode = createSelector(
    [selectSnackBar],
    snackbar => snackbar.mode
)