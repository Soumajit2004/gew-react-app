import PayoutActionTypes from "./payout.types";

const INITIAL_STATE = {
    selectedRows: [],
    isPaying: false,
    isPaymentHistoryFetching: false,
    paymentHistory: []
}

const payoutReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PayoutActionTypes.SET_SELECTED_ROWS:
            return {
                ...state,
                selectedRows: action.payload,
            }
        case PayoutActionTypes.PAY_USERS_START:
            return {
                ...state,
                isPaying: true,
            }
        case PayoutActionTypes.PAY_USERS_SUCCESS:
            return {
                ...state,
                isPaying: false,
                selectedRows: action.payload,
            }
        case PayoutActionTypes.PAY_USERS_FAILURE:
            return {
                ...state,
                isPaying: false,
                selectedRows: action.payload
            }


        case PayoutActionTypes.FETCH_PAY_HISTORY_START:
            return {
                ...state,
                isPaymentHistoryFetching: true,
            }
        case PayoutActionTypes.FETCH_PAY_HISTORY_SUCCESS:
            return {
                ...state,
                isPaymentHistoryFetching: false,
                paymentHistory: action.payload,
            }
        case PayoutActionTypes.FETCH_PAY_HISTORY_FAILURE:
            return {
                ...state,
                isPaymentHistoryFetching: false,
                paymentHistory: []
            }
        default:
            return state
    }
}

export default payoutReducer