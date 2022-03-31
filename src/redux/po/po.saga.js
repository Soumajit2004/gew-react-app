import {db, doxPoFirebaseFnc, storage} from "../../firebase/firebase.utils";
import {put, takeEvery, select, call, delay} from "redux-saga/effects";
import {showMessage} from "../snackbar/snackbar.actions";
import {
    deletePoFinish,
    downloadPoFinish,
    fetchPoFailure,
    fetchPoSuccess, findPoFailure, findPoSuccess,
    savePoFailure,
    savePoSuccess
} from "./po.actions.";
import {PoActionTypes} from "./po.types";
import {deleteDoc, doc, setDoc, Timestamp, updateDoc} from "firebase/firestore";
import {selectPoAdd, selectPoData, selectPoEdit} from "./po.selectors.";
import {selectCurrentUser} from "../user/user.selector";
import {getDownloadURL, ref} from "firebase/storage";
import {downloadFromUrl} from "../../utilils/functions.utilis";
import {customGetPoDoc} from "../../firebase/firebase.functions";
import {poIndex} from "../../algolia/algolia.utility";

export function* fetchPoAsync({payload}) {
    try {
        const response = yield customGetPoDoc(payload)
        const data = yield response.data()
        if (data) {
            yield put(fetchPoSuccess({
                poNumber: response.id,
                ...data
            }))
        } else {
            throw Error("PO not found")
        }
    } catch (e) {
        yield put(showMessage(e.message, "error"))
        yield put(fetchPoFailure())
    }
}

export function* fetchPoStart() {
    yield takeEvery(PoActionTypes.FETCH_PO_START, fetchPoAsync)
}

// Saving Saga

export function* savePoAsync({
                                 payload: {
                                     poNumber, issueNumber, poDate, issueDate, description, rows
                                 }
                             }) {
    try {
        let materials = {}
        yield rows.forEach(({matName, quantity, unit}) => {
            materials[matName] = [quantity, unit]
        })

        let docRef = doc(db, "po", poNumber)
        if (yield select(selectPoAdd)) {

            yield setDoc(docRef, {
                poNumber:poNumber,
                issueNo: issueNumber,
                issueDate: Timestamp.fromDate(issueDate),
                poDate: Timestamp.fromDate(poDate),
                description: description,
                material: materials,
                lastEditedBy: (yield select(selectCurrentUser)).name,
                lastEditedTime: Timestamp.fromDate(new Date())
            })

        } else if (yield select(selectPoEdit)) {
            // updating existing doc
            yield updateDoc(docRef, {
                issueNo: issueNumber,
                issueDate: Timestamp.fromDate(issueDate),
                poDate: Timestamp.fromDate(poDate),
                description: description,
                material: materials,
                lastEditedBy: (yield select(selectCurrentUser)).name,
                lastEditedTime: Timestamp.fromDate(new Date())
            })
        }

        yield put(savePoSuccess({
            poNumber: poNumber,
            issueNo: issueNumber,
            issueDate: Timestamp.fromDate(issueDate),
            poDate: Timestamp.fromDate(poDate),
            description: description,
            material: materials,
            lastEditedBy: (yield select(selectCurrentUser)).name,
            lastEditedTime: Timestamp.fromDate(new Date())
        }))
    } catch (e) {
        yield put(savePoFailure())
        yield put(showMessage(e.message, "error"))
    }

}

export function* savePoStart() {
    yield takeEvery(PoActionTypes.SAVE_PO_START, savePoAsync)
}

// Download Saga

export function* downloadPoAsync() {
    let url = null
    const poNumber = (yield select(selectPoData)).poNumber
    const poDocRef = yield ref(storage, `po-downloads/${poNumber}.docx`)

    try {
        url = yield call(getDownloadURL, poDocRef)
    } catch (e) {
        yield doxPoFirebaseFnc({id: poNumber})
        yield delay(10000)
        url = yield getDownloadURL(poDocRef)
    }
    yield call(downloadFromUrl, url)
    yield put(downloadPoFinish())
}

export function* downloadPoStart() {
    yield takeEvery(PoActionTypes.DOWNLOAD_PO_START, downloadPoAsync)
}

// Delete Saga

export function* deletePoAsync() {
    try{
        yield deleteDoc(doc(db, "po", (yield select(selectPoData)).poNumber))
    }catch (e) {
        yield console.log(e)
    }
    yield put(deletePoFinish())
}

export function* deletePoStart() {
    yield takeEvery(PoActionTypes.DELETE_PO_START, deletePoAsync)
}

// Find PO

export function* findPoAsync({id, field}) {
    try{
        const result = yield poIndex.search(id.toString())
        const hits = result.hits

        yield put(findPoSuccess(hits))
    }catch (e) {
        yield put(showMessage(e.message, "error"))
        yield put(findPoFailure())
    }


}

export function* findPoStart() {
    yield takeEvery(PoActionTypes.FIND_PO_START, findPoAsync)
}