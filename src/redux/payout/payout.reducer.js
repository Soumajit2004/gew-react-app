import PayoutActionTypes from "./payout.types";

const INITIAL_STATE = {
    selectedRows: [],
    isPaying: false,
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
        default:
            return state
    }
}

export default payoutReducer