import {takeEvery, put, select} from "redux-saga/effects"
import {RecentPoActionTypes} from "./recentPo.types";
import {collection, getDocs, limit, orderBy, query} from "firebase/firestore";
import {db} from "../../firebase/firebase.utils";
import {showMessage} from "../snackbar/snackbar.actions";
import {fetchRecentPoSuccess} from "./recentPo.actions";
import {selectRecentPoAll} from "./recentPo.selectors";

export function* fetchRecentPoAsync() {
    try {
        const q = (yield select(selectRecentPoAll)) ?
            query(collection(db, "po"), orderBy("lastEditedTime", "desc")) :
            query(collection(db, "po"), orderBy("lastEditedTime", "desc"), limit(11))
        const data = yield getDocs(q)

        yield put(fetchRecentPoSuccess(data))
    } catch (e) {
        yield put(showMessage(e.message, "error"))
    }
}

export function* fetchRecentPoStart() {
    yield takeEvery(RecentPoActionTypes.FETCH_RECENT_PO_START, fetchRecentPoAsync)
}

