const functions = require('firebase-functions');
const admin = require('firebase-admin');
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
const db = admin.firestore(app)

exports.docxPo = functions
    .region("asia-south1")
    .runWith({
        timeoutSeconds: 300,
        memory: "256MB"
    })
    .https.onCall(async (data, context) => {
        const poRef = db.collection('po').doc(data.id);

        try {
            const doc = await poRef.get();
            const {material, poDate, issueNo, issueDate, description} = doc.data()

            if (doc.exists) {
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

                const file =  await new Document({
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
                                        text: poDate.toString(),
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
                                        text: issueDate.toString(),
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

                Packer.toBuffer(file).then(async (buffer) => {
                    bucket.file(`po-downloads/${data.id}.docx`).save(buffer)
                        .then(() => {
                            return {
                                status: "success"
                            }
                        })
                        .catch((e) => {
                            return {
                                status:e.toString()
                            }
                        })
                })


            }
        } catch (e) {
            return {
                status: e.toString()
            }
        }
    })