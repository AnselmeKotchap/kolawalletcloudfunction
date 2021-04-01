const functions = require('firebase-functions');
const notification = require('./FCM/main');

exports.sendKolaNotification = functions.https.onRequest((req, res) => {
    notification.sendKolaMessageToAllUsers("Bonjour c'est KOLA", "Body body body")
    res.send("Hello");
});