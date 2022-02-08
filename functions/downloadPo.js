const express = require('express');
const cors = require('cors');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
app.get("/api/download?id=")

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);