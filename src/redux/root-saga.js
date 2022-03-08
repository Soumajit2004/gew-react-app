import {all, call} from "redux-saga/effects"
import {fetchRecentPoStart} from "./recentPo/recentPo.saga";
import {deletePoStart, downloadPoStart, fetchPoStart, savePoStart} from "./po/po.saga";

export default function* rootSaga() {
    yield all([
        call(fetchRecentPoStart),
        call(fetchPoStart),
        call(savePoStart),
        call(downloadPoStart),
        call(deletePoStart)
    ])
}