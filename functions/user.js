const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

const auth = admin.auth();

let razorPayAuth = {}
if (process.env.NODE_ENV === 'development') {
    razorPayAuth = {
        username: "rzp_test_aK2KAFwspim1Ha",
        password: "9glQAcfPqMUKVE3wtfZpfKdD"
    }
} else {
    razorPayAuth = {
        username: "rzp_live_Ux818qeSWDkBvF",
        password: "gMXYttMmMMXo6Im8WakNCN7J"
    }
}

exports.createUserWithPhone = functions
    .runWith({
        timeoutSeconds: 30,
        memory: "128MB"
    })
    .region("asia-south1")
    .https.onCall((data, context) => {
        const {phoneNumber} = data

        if (context.auth.uid) {
            return auth.createUser({
                phoneNumber: phoneNumber
            })
                .then(r => {
                    return {uid: r.uid}
                })
                .catch(e => {
                    return {error: e.toString()}
                })
        }
    })

exports.deleteUser = functions
    .runWith({
        timeoutSeconds: 180,
        memory: "128MB"
    })
    .region("asia-south1")
    .https.onCall((d, context) => {
        const {id, razorpayContact, razorpayFund} = d
        console.log(d)
        if (context.auth) {
            const configData = {
                "active": false
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                auth: razorPayAuth,
            }

            return axios.patch(`https://api.razorpay.com/v1/contacts/${razorpayContact}`, configData, config)
                .then((r) => {
                    return axios.patch(`https://api.razorpay.com/v1/fund_accounts/${razorpayFund}`, configData, config)
                })
                .catch((e)=>{
                    console.log(e.message)
                })
                .then((r) => {
                    return auth.deleteUser(id)
                })
                .then((r) => {
                    return db.collection('users').doc(id).delete()
                })
                .then((r) => {
                    return {status: "Success"}
                })
                .catch(e => {
                    return {status: e.message}
                })
        }
    })