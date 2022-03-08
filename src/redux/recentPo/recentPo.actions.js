import {RecentPoActionTypes} from "./recentPo.types";

export const fetchRecentPo = () => {
    return {
        type: RecentPoActionTypes.FETCH_RECENT_PO_START,
    }
}

export const fetchRecentPoSuccess = data => {
    return {
        type: RecentPoActionTypes.FETCH_RECENT_PO_SUCCESS,
        payload: data
    }
}

export const fetchRecentPoFailure = () => {
    return {
        type: RecentPoActionTypes.FETCH_RECENT_PO_SUCCESS,
    }
}

