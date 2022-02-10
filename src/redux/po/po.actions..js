import {PoActionTypes} from "./po.types";

export const setPoData = ({poDate, issueDate, lastEditedTime, ...otherData}) => {
    return {
        type: PoActionTypes.SET_PO_RESULT,
        payload: {
            poDate: poDate.toDate(),
            issueDate: issueDate.toDate(),
            lastEditedTime: lastEditedTime.toDate(),
            ...otherData
        }
    }
}

export const setRecentPo = (docsList) => {
    return {
        type: PoActionTypes.SET_RECENT_PO,
        payload: docsList
    }
}

export const setSearchText = text => {
    return {
        type: PoActionTypes.SET_SEARCH_TEXT,
        payload: text
    }
}

export const toggleViewMode = () => {
    return {
        type: PoActionTypes.TOGGLE_VIEW_MODE,
    }
}

export const toggleAddMode = () => {
    return {
        type: PoActionTypes.TOGGLE_ADD_MODE,
    }
}

export const toggleEditMode = () => {
    return {
        type: PoActionTypes.TOGGLE_EDIT_MODE,
    }
}