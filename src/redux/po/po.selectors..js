import {createSelector} from "reselect";

const selectPo = state => state.po

export const selectPoData = createSelector(
    [selectPo],
    po => po.poData
)

export const selectMatchingPO = createSelector(
    [selectPo],
    po => po.matchingPo
)

export const selectIsFinding = createSelector(
    [selectPo],
    po => po.isFinding
)

export const selectPoSearch = createSelector(
    [selectPo],
    po => po.searchText
)

export const selectIsPoFetching = createSelector(
    [selectPo],
    po => po.isFetching
)

export const selectPoView = createSelector(
    [selectPo],
    po => po.viewMode
)

export const selectPoEdit = createSelector(
    [selectPo],
    po => po.editMode
)

export const selectPoAdd = createSelector(
    [selectPo],
    po => po.addMode
)