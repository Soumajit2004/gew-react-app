import {all, call} from "redux-saga/effects"
import {fetchRecentPoStart} from "./recentPo/recentPo.saga";
import {deletePoStart, downloadPoStart, fetchPoStart, findPoStart, savePoStart} from "./po/po.saga";
import {fetchUsersStart} from "./user/user.saga";
import {payUsersStart} from "./payout/payout.saga.";

export default function* rootSaga() {
    yield all([
        call(fetchRecentPoStart),
        call(fetchPoStart),
        call(savePoStart),
        call(downloadPoStart),
        call(deletePoStart),
        call(fetchUsersStart),
        call(payUsersStart),
        call(findPoStart)
    ])
}