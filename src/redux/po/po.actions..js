import {PoActionTypes} from "./po.types";

// Fetch PO

export const fetchPo = () => {
    return {
        type: PoActionTypes.FETCH_PO_START,
    }
}

export const fetchPoSuccess = ({poDate, issueDate, lastEditedTime, ...otherData}) => {
    return {
        type: PoActionTypes.FETCH_PO_SUCCESS,
        payload: {
            poDate: poDate.toDate(),
            issueDate: issueDate.toDate(),
            lastEditedTime: lastEditedTime.toDate(),
            ...otherData
        }
    }
}

export const fetchPoFailure = () => {
    return {
        type: PoActionTypes.FETCH_PO_FAILURE
    }
}

// Save PO

export const savePo = (data) => {
    return {
        type: PoActionTypes.SAVE_PO_START,
        payload:data
    }
}

export const savePoSuccess = ({poDate, issueDate, lastEditedTime, ...otherData}) => {
    return {
        type: PoActionTypes.SAVE_PO_SUCCESS,
        payload: {
            poDate: poDate.toDate(),
            issueDate: issueDate.toDate(),
            lastEditedTime: lastEditedTime.toDate(),
            ...otherData
        }
    }
}

export const savePoFailure = () => {
    return {
        type: PoActionTypes.SAVE_PO_FAILURE
    }
}

//DownLoad PO

export const downloadPo = () => {
    return {
        type: PoActionTypes.DOWNLOAD_PO_START,
    }
}

export const downloadPoFinish = () => {
    return {
        type: PoActionTypes.DOWNLOAD_PO_FINISH,
    }
}

// Delete Po

export const deletePo = () => {
    return {
        type: PoActionTypes.DELETE_PO_START,
    }
}

export const deletePoFinish = () => {
    return {
        type: PoActionTypes.DELETE_PO_FINISH,
    }
}

// Others

export const setSearchText = (text) => {
    return {
        type: PoActionTypes.SET_SEARCH_TEXT,
        payload: text.toString()
    }
}

export const setAddMode = (bool) => {
    return {
        type: PoActionTypes.SET_ADD_MODE,
        payload: bool
    }
}

export const setEditMode = (bool) => {
    return {
        type: PoActionTypes.SET_EDIT_MODE,
        payload: bool
    }
}

export const setViewMode = (bool) => {
    return {
        type: PoActionTypes.SET_VIEW_MODE,
        payload: bool
    }
}