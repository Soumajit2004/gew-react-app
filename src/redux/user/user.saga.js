import {put, takeEvery} from "redux-saga/effects";
import {UserActionTypes} from "./user.types";
import {collection, doc, getDoc, getDocs, orderBy, query} from "firebase/firestore";
import {db} from "../../firebase/firebase.utils";
import {showMessage} from "../snackbar/snackbar.actions";
import {fetchUsersSuccess} from "./user.actions";

export function* fetchUsersAsync() {
    try {
        const userQuery = yield getDocs(query(collection(db, "users"), orderBy("name", "asc")));

        const filteredRows = []
        for (const elem of userQuery.docs) {
            const data = yield elem.data()

            if (data.role !== "owner") {
                let lastPayedDate = ""
                if (data.lastPayed) {
                    const paymentData = (yield getDoc(doc(db, "paymentHistory", data.lastPayed))).data()
                    lastPayedDate = yield new Date(parseInt(paymentData.created_at) * 1000)
                }

                filteredRows.push({id: elem.id, lastPayedDate: lastPayedDate.toString(), ...data})
            }
        }

        yield put(fetchUsersSuccess(userQuery.docs, filteredRows))
    } catch (e) {
       yield  put(showMessage(e.message, "error"))
    }
}

export function* fetchUsersStart() {
    yield takeEvery(UserActionTypes.FETCH_USERS_START, fetchUsersAsync)
}