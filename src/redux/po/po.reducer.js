import {PoActionTypes} from "./po.types";


const INITIAL_STATE = {
    poData : {},
    searchText:"",
    viewMode:false,
    editMode:false,
    addMode:false,
    isFetching:false,
}

const poReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PoActionTypes.SET_SEARCH_TEXT:
            return {
                ...state,
                searchText: action.payload,
            }
        case PoActionTypes.SET_ADD_MODE:
            return {
                ...state,
                addMode: action.payload
            }
        case PoActionTypes.SET_EDIT_MODE:
            return {
                ...state,
                editMode: action.payload
            }
        case PoActionTypes.SET_VIEW_MODE:
            return {
                ...state,
                viewMode: action.payload
            }

        case PoActionTypes.FETCH_PO_START:
            return {
                ...state,
                isFetching: true,
            }
        case PoActionTypes.FETCH_PO_SUCCESS:
            return {
                ...state,
                isFetching: false,
                viewMode: true,
                editMode: false,
                addMode: false,
                poData: action.payload
            }
        case PoActionTypes.FETCH_PO_FAILURE:
            return {
                ...state,
                isFetching: false,
            }

        case PoActionTypes.SAVE_PO_START:
            return {
                ...state,
                isFetching: true,
            }
        case PoActionTypes.SAVE_PO_SUCCESS:
            return {
                ...state,
                isFetching: false,
                viewMode: true,
                addMode: false,
                editMode: false,
                poData: action.payload
            }
        case PoActionTypes.SAVE_PO_FAILURE:
            return {
                ...state,
                isFetching: false,
            }

        case PoActionTypes.DOWNLOAD_PO_START:
            return {
                ...state,
                isFetching: true,
            }
        case PoActionTypes.DOWNLOAD_PO_FINISH:
            return {
                ...state,
                isFetching: false,
            }

        case PoActionTypes.DELETE_PO_START:
            return {
                ...state,
                isFetching: true,
            }
        case PoActionTypes.DELETE_PO_FINISH:
            return {
                ...state,
                isFetching: false,
                poData: {},
                searchText: "",
                viewMode: false,
                editMode: false,
                addMode: false
            }
        default:
            return state
    }
}

export default poReducer