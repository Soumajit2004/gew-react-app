import {UserActionTypes} from "./user.types";

const INITIAL_STATE = {
    currentUser : null,
    users:[],
    userRows:[],
    isFetching:false
}

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UserActionTypes.SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload,
            }

        case UserActionTypes.FETCH_USERS_START:
            return {
                ...state,
                isFetching: true
            }
        case UserActionTypes.FETCH_USERS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                users: action.users,
                userRows: action.userRows
            }
        case UserActionTypes.FETCH_USERS_FAILURE:
            return {
                ...state,
                isFetching: false,
                users: [],
                userRows: []
            }
        default:
            return state
    }
}

export default userReducer