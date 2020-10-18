const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();
module.exports=({auth, db, storage})