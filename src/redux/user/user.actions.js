import {UserActionTypes} from "./user.types";

export const setCurrentUser = user => {
    return {
        type: UserActionTypes.SET_CURRENT_USER,
            payload: user
    }
}

export const fetchUsers = () => {
    return {
        type: UserActionTypes.FETCH_USERS_START,
    }
}

export const fetchUsersSuccess = (usersList, userRows) => {
    return {
        type: UserActionTypes.FETCH_USERS_SUCCESS,
        users: usersList,
        userRows: userRows
    }
}

export const fetchUsersFailure = () => {
    return {
        type: UserActionTypes.FETCH_USERS_FAILURE
    }
}