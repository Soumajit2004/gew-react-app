import {takeEvery} from "redux-saga/effects"
import {PoActionTypes} from "./po.types";

export function* searchPO() {
    yield takeEvery(PoActionTypes.sea)
}