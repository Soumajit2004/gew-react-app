import {customGetPoDoc, db, doxPoFirebaseFnc, storage} from "../../firebase/firebase.utils";
import {put, takeEvery, select, call, delay} from "redux-saga/effects";
import {showMessage} from "../snackbar/snackbar.actions";
import {
    deletePoFinish,
    downloadPoFinish,
    fetchPoFailure,
    fetchPoSuccess,
    savePoFailure,
    savePoSuccess
} from "./po.actions.";
import {PoActionTypes} from "./po.types";
import {deleteDoc, doc, setDoc, Timestamp, updateDoc} from "firebase/firestore";
import {selectPoAdd, selectPoData, selectPoEdit, selectPoSearch} from "./po.selectors.";
import {selectCurrentUser} from "../user/user.selector";
import {getDownloadURL, ref} from "firebase/storage";
import {downloadFromUrl} from "../../utilils/functions.utilis";

export function* fetchPoAsync() {
    try {
        const response = yield customGetPoDoc(yield select(selectPoSearch))
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
        console.log(e)
        yield put(showMessage(e.message))
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
        console.log(e.message)
        yield put(savePoFailure())
        yield put(showMessage(e.message))
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