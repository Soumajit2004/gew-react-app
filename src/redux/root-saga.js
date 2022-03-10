import {all, call} from "redux-saga/effects"
import {fetchRecentPoStart} from "./recentPo/recentPo.saga";
import {deletePoStart, downloadPoStart, fetchPoStart, savePoStart} from "./po/po.saga";
import {fetchUsersStart} from "./user/user.saga";

export default function* rootSaga() {
    yield all([
        call(fetchRecentPoStart),
        call(fetchPoStart),
        call(savePoStart),
        call(downloadPoStart),
        call(deletePoStart),
        call(fetchUsersStart)
    ])
}