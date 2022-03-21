const functions = require("firebase-functions");
const axios = require("axios");
const admin = require("firebase-admin");

const db = admin.firestore()

const razorPayAuth = {
    username: "rzp_test_aK2KAFwspim1Ha",
    password: "9glQAcfPqMUKVE3wtfZpfKdD"
}

exports.payUsers = functions
    .runWith({
        timeoutSeconds: 60,
        memory: "128MB"
    })
    .region("asia-south1")
    .https.onCall((d, context) => {
        const {id, amount} = d

        if (context.auth) {
            return db.collection("users").doc(id).get()
                .then(r => {
                    const data = r.data()

                    const configData = JSON.stringify({
                        "account_number": "2323230065575310",
                        "fund_account_id": data.razorpayFund,
                        "amount": (amount ? parseInt(amount) : parseInt(data.salary)) * 100,
                        "currency": "INR",
                        "mode": "IMPS",
                        "purpose": "salary",
                        "queue_if_low_balance": true,
                        "narration": `Salary of ${data.name}`,
                        "notes": {
                            "uid": id,
                            "name": data.name
                        }
                    })

                    const config = {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        auth: razorPayAuth,
                    }

                    return axios.post("https://api.razorpay.com/v1/payouts", configData, config)
                })
                .then((r) => {
                    return {status: "success", data: r.data}
                })
                .catch(e => {
                    return {status: "error"}
                })
        }
    })

exports.rezorpayAccountCreator = functions
    .runWith({
        timeoutSeconds: 60,
        memory: "128MB"
    })
    .region("asia-south1")
    .firestore.document("users/{uid}")
    .onCreate((doc, context) => {
        const data = doc.data()
        let razorpayContact = ""

        const config = {
            method: "post",
            url: "https://api.razorpay.com/v1/contacts",
            headers: {
                "Content-Type": "application/json",
            },
            auth: razorPayAuth,
            data: {
                "name": data.name,
                "contact": data.phoneNumber,
                "type": "employee",
                "reference_id": doc.id,
            }
        }

        return axios.request(config)
            .then((r) => {
                razorpayContact = r.data.id
                const configFund = {
                    method: "post",
                    url: "https://api.razorpay.com/v1/fund_accounts",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    auth: razorPayAuth,
                    data: {
                        "contact_id": r.data.id,
                        "account_type": "bank_account",
                        "bank_account": {
                            "name": data.name,
                            "ifsc": data.ifscCode,
                            "account_number": data.bankAccountNumber
                        }
                    }
                }

                return axios.request(configFund)
            })
            .then((r) => {
                const userRef = db.collection('users').doc(doc.id)

                return userRef.set({razorpayContact: razorpayContact, razorpayFund: r.data.id}, {merge: true})
            })
            .catch(e => {
                return {error: e.message}
            })
    })

const razorPayWebhookSecret = "i_am_2_Webhook"
const crypto = require('crypto')
const express = require('express')
const hooksExpressApp = express()

hooksExpressApp.post("/", async (req, res) => {

    const shaSum = crypto.createHmac('sha256', razorPayWebhookSecret)
    shaSum.update(JSON.stringify(req.body))
    const digest = shaSum.digest('hex')

    if (digest === req.headers['x-razorpay-signature']) {
        try {
            const data = req.body.payload.payout.entity

            switch (req.body.event) {
                case "payout.processed":
                    await db.collection("users").doc(data.notes.uid).set({
                        lastPayed: data.utr
                    }, {merge: true})
                    break
                default:
                    break
            }
            await db.collection("paymentHistory").doc(data.utr).set(data)

            res.send({status: "ok"})
        } catch (e) {
            res.send({status: "error"})
        }
    } else {
        res.send({status: "error"})
    }
})

exports.razorPayWebhooks = functions
    .region("asia-south1")
    .https.onRequest(hooksExpressApp)