import {PoActionTypes} from "./po.types";


const INITIAL_STATE = {
    poData : {},
    searchText:"",
    viewMode:false,
    editMode:false,
    addMode:false,
    recentPo:[]
}

const poReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PoActionTypes.SET_PO_RESULT:
            return {
                ...state,
                poData: action.payload,
            }
        case PoActionTypes.SET_SEARCH_TEXT:
            return {
                ...state,
                searchText: action.payload,
            }
        case PoActionTypes.TOGGLE_VIEW_MODE:
            return {
                ...state,
                viewMode: !state.viewMode,
            }
        case PoActionTypes.TOGGLE_EDIT_MODE:
            return {
                ...state,
                editMode: !state.editMode,
            }
        case PoActionTypes.TOGGLE_ADD_MODE:
            return {
                ...state,
                addMode: !state.addMode,
            }
        case PoActionTypes.SET_RECENT_PO:
            return {
                ...state,
                recentPo: action.payload,
            }
        default:
            return state
    }
}

export default poReducer