import {put, select, takeEvery} from "redux-saga/effects";
import PayoutActionTypes from "./payout.types";
import {payUserFnc} from "../../firebase/firebase.utils";
import {selectSelectedPayouts} from "./payout.selectors";
import {showMessage} from "../snackbar/snackbar.actions";
import {payUsersFailure, payUsersSuccess} from "./payout.actions";

export function* payUsersAsync({mode, amount}) {
    const selections = yield select(selectSelectedPayouts)

    if (selections.length > 0) {
        for (let id of selections) {
            try {
                if (mode === "custom") {
                    yield payUserFnc({id: id.toString(), amount: parseInt(amount)})
                }else if (mode === "salary") {
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