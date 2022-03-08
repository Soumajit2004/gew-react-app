import {createSelector} from "reselect";

const selectRPo = state => state.recentPo

export const selectRecentPo = createSelector(
    [selectRPo],
    recentPo => recentPo.recentPo
)

export const selectRecentPoAll = createSelector(
    [selectRPo],
    recentPo => recentPo.viewAll
)