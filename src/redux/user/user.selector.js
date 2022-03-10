import {createSelector} from "reselect";

const selectUser = state => state.user;

export const selectCurrentUser = createSelector(
    [selectUser],
    user => user.currentUser
)

export const selectUsers = createSelector(
    [selectUser],
    user => user.users
)

export const selectUsersRows = createSelector(
    [selectUser],
    user => user.userRows
)

export const selectIsUsersFetching = createSelector(
    [selectUser],
    user => user.isFetching
)