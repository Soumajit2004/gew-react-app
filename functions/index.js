const admin = require('firebase-admin');
const serviceAccount = require('./ghosh-ele-works-firebase-adminsdk-heq28-c38f7ea580.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'ghosh-ele-works.appspot.com'
});

exports.user = require("./user")
exports.po = require("./po")
exports.razorPay = require("./razorPay")