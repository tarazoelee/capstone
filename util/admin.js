const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with your Firebase configuration
const serviceAccount = require('../capstone-74be8-firebase-adminsdk-i3t35-a863dbb7a3.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = { admin, db };

/*
const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

*/