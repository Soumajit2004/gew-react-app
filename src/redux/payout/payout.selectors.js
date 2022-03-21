import {createSelector} from "reselect";

const selectPayout = state => state.payout

export const selectSelectedPayouts = createSelector(
    [selectPayout],
    payout => payout.selectedRows
)

export const selectIsPaying = createSelector(
    [selectPayout],
    payout => payout.isPaying
)