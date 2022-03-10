import {doc, getDoc, getDocFromCache} from "firebase/firestore";
import {db} from "./firebase.utils";

export const customGetPoDoc = async (poId) => {
    const docRef = doc(db, "po", poId.toString());
    let res = null

    try {
        res = await getDocFromCache(docRef)
    } catch (e) {
        res = await getDoc(docRef)
    }

    return res
}