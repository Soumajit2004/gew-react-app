import PayoutActionTypes from "./payout.types";

export const setPayoutRows = (rows) => {
    return {
        type: PayoutActionTypes.SET_SELECTED_ROWS,
        payload: rows
    }
}

export const payUsers = ({mode, amount}) => {
    return {
        type: PayoutActionTypes.PAY_USERS_START,
        mode: mode,
        amount: amount
    }
}

export const payUsersSuccess = (unpaidRows) => {
    return {
        type: PayoutActionTypes.PAY_USERS_SUCCESS,
        payload: unpaidRows
    }
}

export const payUsersFailure = (unpaidRows) => {
    return {
        type: PayoutActionTypes.PAY_USERS_FAILURE,
        payload: unpaidRows
    }
}

export const fetchPaymentHistory = ({startUnixTime, endUnixTime}) => {
    return {
        type: PayoutActionTypes.FETCH_PAY_HISTORY_START,
        startUnixTime: startUnixTime,
        endUnixTime: endUnixTime
    }
}

export const fetchPaymentHistorySuccess = (paymentRows) => {
    return {
        type: PayoutActionTypes.FETCH_PAY_HISTORY_SUCCESS,
        payload: paymentRows
    }
}

export const fetchPaymentHistoryFailure = () => {
    return {
        type: PayoutActionTypes.FETCH_PAY_HISTORY_FAILURE,
    }
}