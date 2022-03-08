import {RecentPoActionTypes} from "./recentPo.types";

const INITIAL_STATE = {
    recentPo: [],
    isFetching: false,
    viewAll:false
}

const recentPoReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case RecentPoActionTypes.FETCH_RECENT_PO_START:
            return {
                ...state,
                isFetching: true
            }
        case RecentPoActionTypes.FETCH_RECENT_PO_SUCCESS:
            return {
                ...state,
                isFetching: false,
                recentPo: action.payload
            }
        case RecentPoActionTypes.FETCH_RECENT_PO_FAILURE:
            return {
                ...state,
                isFetching: false,
                recentPo: []
            }
        case RecentPoActionTypes.SET_RECENT_PO_ALL:
            return {
                ...state,
                viewAll: action.payload
            }
        default:
            return state
    }
}

export default recentPoReducer