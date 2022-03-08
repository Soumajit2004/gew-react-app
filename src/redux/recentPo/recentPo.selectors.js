import {createSelector} from "reselect";

const selectPo = state => state.recentPo

export const selectRecentPo = createSelector(
    [selectPo],
    po => po.recentPo
)