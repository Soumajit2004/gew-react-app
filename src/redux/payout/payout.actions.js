import PayoutActionTypes from "./payout.types";

export const setPayoutRows = (rows) => {
    return{
        type: PayoutActionTypes.SET_SELECTED_ROWS,
        payload: rows
    }
}

export const payUsers = ({mode, amount}) => {
    return{
        type: PayoutActionTypes.PAY_USERS_START,
        mode: mode,
        amount: amount
    }
}

export const payUsersSuccess = (unpaidRows) => {
    return{
        type: PayoutActionTypes.PAY_USERS_SUCCESS,
        payload: unpaidRows
    }
}

export const payUsersFailure = (unpaidRows) => {
    return{
        type: PayoutActionTypes.PAY_USERS_FAILURE,
        payload: unpaidRows
    }
}