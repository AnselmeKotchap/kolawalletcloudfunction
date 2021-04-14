const functions = require('firebase-functions');
const notificationModule = require('./FCM/main');
const notifEntity = require('./entities/Notification');
const dataTopicEntity = require('./entities/DataTopic');
const dataTokenEntity = require('./entities/DataToken');

exports.sendKolaNotification = functions.https.onRequest((req, res) => {
    notificationModule.sendKolaMessageToAllUsers("Bonjour c'est KOLA", "Body body body")
    res.send("sendKolaNotification");
});

exports.sendNotificationToTopic = functions.https.onRequest((req, res) => {
    let data = new dataTopicEntity.DataTopic("KUSER/yeyeyeye/GROUPESAVING", "DELETE", "Group")
    let topic = "KOLA"

    notificationModule.sendMessageToTopicForSync(topic, data)
    res.send("sendNotificationToTopic");
});