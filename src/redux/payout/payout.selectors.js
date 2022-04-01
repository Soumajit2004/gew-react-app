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

export const selectPaymentHistory = createSelector(
    [selectPayout],
    payout => payout.paymentHistory
)

export const selectIsPaymentHistoryFetching = createSelector(
    [selectPayout],
    payout => payout.isPaymentHistoryFetching
)