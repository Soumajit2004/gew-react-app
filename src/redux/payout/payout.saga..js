import {put, select, takeEvery} from "redux-saga/effects";
import PayoutActionTypes from "./payout.types";
import {db, payUserFnc} from "../../firebase/firebase.utils";
import {selectSelectedPayouts} from "./payout.selectors";
import {showMessage} from "../snackbar/snackbar.actions";
import {
    fetchPaymentHistoryFailure,
    fetchPaymentHistorySuccess,
    payUsersFailure,
    payUsersSuccess
} from "./payout.actions";
import {collection, getDocs, query, where} from "firebase/firestore";

export function* payUsersAsync({mode, amount}) {
    const selections = yield select(selectSelectedPayouts)

    if (selections.length > 0) {
        for (let id of selections) {
            try {
                if (mode === "custom") {
                    yield payUserFnc({id: id.toString(), amount: parseInt(amount)})
                } else if (mode === "salary") {
                    yield payUserFnc({id: id.toString()})
                }
            } catch (er) {
                yield put(payUsersFailure([]))
                yield put(showMessage(er.message, "error"))
            }
        }

        yield put(payUsersSuccess([]))
        yield put(showMessage("Paid Successfully", "success"))
    }
}

export function* payUsersStart() {
    yield takeEvery(PayoutActionTypes.PAY_USERS_START, payUsersAsync)
}


export function* fetchPaymentHistoryAsync({startUnixTime, endUnixTime}) {
    try {
        const paymentHistoryRef = collection(db, "paymentHistory");
        const q = query(paymentHistoryRef, where("created_at", ">=", startUnixTime), where("created_at", "<=", endUnixTime));
        const snap = yield getDocs(q)

        const formatData = []
        snap.docs.forEach((e)=>{
            const d = e.data()
            formatData.push({name:d.notes.name, rAmount:d.amount/100, ...d})
        })
        yield put(fetchPaymentHistorySuccess(formatData))
    } catch (e) {
        yield put(fetchPaymentHistoryFailure())
    }
}

export function* fetchPaymentHistoryStart() {
    yield takeEvery(PayoutActionTypes.FETCH_PAY_HISTORY_START, fetchPaymentHistoryAsync)
}