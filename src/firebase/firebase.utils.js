import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth, browserSessionPersistence} from "firebase/auth";
import {getFirestore, getDocFromCache, doc, getDoc} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB-8K5SLVIWTiOQiJF1Sb4jLU4xDtKJ92c",
    authDomain: "ghosh-ele-works.firebaseapp.com",
    projectId: "ghosh-ele-works",
    storageBucket: "ghosh-ele-works.appspot.com",
    messagingSenderId: "595917924602",
    appId: "1:595917924602:web:a6994abfdd380c90520143",
    measurementId: "G-6Y9T9RXJ4X"
};

const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);

export const auth = getAuth()

auth.setPersistence(browserSessionPersistence).then(r => {})

export const db = getFirestore()

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
