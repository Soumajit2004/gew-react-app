import {initializeApp} from "firebase/app";
import {initializeAppCheck, ReCaptchaV3Provider} from "firebase/app-check";
import {getAnalytics} from "firebase/analytics";
import {getAuth, browserSessionPersistence, setPersistence, connectAuthEmulator} from "firebase/auth";
import {getFirestore, connectFirestoreEmulator} from "firebase/firestore";
import { getFunctions, httpsCallable, connectFunctionsEmulator} from 'firebase/functions';
import { getStorage, connectStorageEmulator} from 'firebase/storage';
import { getPerformance } from "firebase/performance";

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

export const auth = getAuth(app)
setPersistence(auth, browserSessionPersistence)


export const db = getFirestore(app)
export const storage = getStorage(app);
const functions = getFunctions(app, "asia-south1")
const performance = getPerformance(app)
console.log(performance.dataCollectionEnabled)

if (process.env.NODE_ENV === 'development'){
    connectAuthEmulator(auth, "http://localhost:9099")
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, "localhost", 9199);
    connectFunctionsEmulator(functions, "localhost", 5001);
}else{
    initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider('6Ldm0cUeAAAAAKHkhbFwEQMLXW8ZK8RqGEzwTQ_h'),
        isTokenAutoRefreshEnabled: true
    });
}

export const createUserWithPhone = httpsCallable(functions, 'user-createUserWithPhone')
export const doxPoFirebaseFnc = httpsCallable(functions, 'po-docxPo')
export const payUserFnc = httpsCallable(functions, 'razorPay-payUsers')
export const deleteUserFnc = httpsCallable(functions, 'user-deleteUser')





