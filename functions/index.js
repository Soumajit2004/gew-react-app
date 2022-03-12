const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require("axios")
const {
    AlignmentType,
    Document,
    HeightRule,
    Packer,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    TextRun, VerticalAlign,
    WidthType
} = require("docx");
const serviceAccount = require('./ghosh-ele-works-firebase-adminsdk-heq28-c38f7ea580.json');

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'ghosh-ele-works.appspot.com'
});

const bucket = admin.storage().bucket();
const auth = admin.auth(app);
const db = admin.firestore(app)

const razorPayAuth = {
    username: "rzp_test_aK2KAFwspim1Ha",
    password: "9glQAcfPqMUKVE3wtfZpfKdD"
}

/////////////////////////// Callable Functions ///////////////////////////////////

exports.docxPo = functions
    .region("asia-south1")
    .runWith({
        timeoutSeconds: 120,
        memory: "512MB"
    })
    .https.onCall(async (data, context) => {
        const poRef = db.collection('po').doc(data.id);

        const parseMyDate = (date) => {
            const ddDate = (int) => {
                if (int < 10) {
                    return `0${int.toString()}`
                } else {
                    return int
                }
            }
            return `${ddDate(parseInt(date.getDate()))}-${ddDate(parseInt(date.getMonth()) + 1)}-${date.getFullYear()}`
        }

        return poRef.get()
            .then((r) => {
                const {material, poDate, issueNo, issueDate, description} = r.data()

                const table = new Table({
                    width: {
                        size: 9000,
                        type: WidthType.DXA
                    },
                    rows: [
                        new TableRow({
                            tableHeader: true,
                            height: {value: 400, rule: HeightRule.ATLEAST},
                            children: [
                                new TableCell({
                                    verticalAlign: VerticalAlign.CENTER,
                                    children: [new Paragraph("Description of Material")]
                                }),
                                new TableCell({
                                    verticalAlign: VerticalAlign.CENTER,
                                    children: [new Paragraph("Unit Name")]
                                }),
                                new TableCell({
                                    verticalAlign: VerticalAlign.CENTER,
                                    children: [new Paragraph("Quantity")]
                                })
                            ]
                        })

                    ]
                })

                for (let elm in material) {
                    table.addChildElement(
                        new TableRow({
                            height: {value: 400, rule: HeightRule.ATLEAST},
                            children: [
                                new TableCell({
                                    verticalAlign: VerticalAlign.CENTER,
                                    children: [new Paragraph(elm)]
                                }),
                                new TableCell({
                                    verticalAlign: VerticalAlign.CENTER,
                                    children: [new Paragraph(material[elm][1].toString())]
                                }),
                                new TableCell({
                                    verticalAlign: VerticalAlign.CENTER,
                                    children: [new Paragraph(material[elm][0].toString())]
                                })
                            ]
                        })
                    )
                }

                return new Document({
                    sections: [{
                        properties: {},
                        children: [
                            new Paragraph({
                                spacing: {line: 300},
                                children: [
                                    new TextRun({text: "Po No: "}),
                                    new TextRun({
                                        text: `${data.id}\n`,
                                        bold: true,
                                    }),
                                ],
                            }),
                            new Paragraph({
                                spacing: {line: 600},
                                children: [
                                    new TextRun("PO Date: "),
                                    new TextRun({
                                        text: parseMyDate(poDate.toDate()),
                                        bold: true,
                                    }),
                                ],
                            }),
                            new Paragraph({
                                spacing: {line: 300},
                                children: [
                                    new TextRun("Memo No: "),
                                    new TextRun({
                                        text: issueNo.toString(),
                                        bold: true,
                                    }),
                                ],
                            }),
                            new Paragraph({
                                spacing: {line: 600},
                                children: [
                                    new TextRun("Memo Date: "),
                                    new TextRun({
                                        text: parseMyDate(issueDate.toDate()),
                                        bold: true,
                                    }),
                                ],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.JUSTIFIED,
                                spacing: {line: 300},
                                children: [
                                    new TextRun("Description: "),
                                    new TextRun({
                                        text: description.toString(),
                                        bold: true,
                                    }),
                                ],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.JUSTIFIED,
                                spacing: {line: 300},
                                children: [
                                    new TextRun(" "),
                                ],
                            }),
                            table
                        ],
                    }],
                })
            })
            .then((file) => {
                return Packer.toBuffer(file)
            })
            .then((buffer) => {
                return bucket.file(`po-downloads/${data.id}.docx`).save(buffer)
            })
            .then(() => {
                return {status: "success"}
            })
            .catch((e) => {
                return {status: e.toString()}
            })


    })

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

exports.payUsers = functions
    .runWith({
        timeoutSeconds: 60,
        memory: "128MB"
    })
    .region("asia-south1")
    .https.onCall((d, context) => {
        const {id} = d

        if (context.auth) {
            return db.collection("users").doc(id).get()
                .then(r => {
                    const data = r.data()

                    const configData = JSON.stringify({
                        "account_number": "2323230065575310",
                        "fund_account_id": data.razorpayFund,
                        "amount": parseInt(data.salary) * 100,
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
                    return {status: r.data}
                })
                .catch(e => {
                    return {status: e.message}
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

///////////////////////////// Scheduled Functions //////////////////////////////////

exports.deletePoDownloads = functions
    .runWith({
        timeoutSeconds: 60,
        memory: "128MB"
    })
    .region("asia-south1")
    .pubsub.schedule("00 12 * * 7")
    .timeZone("Asia/Kolkata")
    .onRun(async () => {
        await bucket.deleteFiles({prefix: "po-downloads/"})
    })

////////////////////////////// Background Functions //////////////////////////////////

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

exports.rezorpayAccountDeactivator = functions
    .runWith({
        timeoutSeconds: 60,
        memory: "128MB"
    })
    .region("asia-south1")
    .firestore.document("users/{uid}")
    .onDelete((doc, context) => {
        const deletedValue = doc.data();

        try {
            const config = {
                method: "patch",
                url: `https://api.razorpay.com/v1/contacts/${deletedValue.razorpayContact}`,
                auth: razorPayAuth,
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    "active": false
                }
            }
            return axios.request(config)
        } catch (e) {
            return {"error": e.message}
        }

    })

/////////////////////////////// HTTP Functions ///////////////////////////////////////

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
                default:
                    await db.collection("paymentHistory").doc(data.utr).set(data)
                    break
            }

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