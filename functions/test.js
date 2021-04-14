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
    let imageUrl = "https://firebasestorage.googleapis.com/v0/b/kola-wallet-dev.appspot.com/o/FCMImages%2Fbitmoji-20190131055305.png?alt=media&token=cfe2f5b6-7ef9-4926-825d-ed600aea07eb"
    //let notification = new notifEntity.Notification("Bonjour c'est KOLA", "Message de notification topic avec data", imageUrl)
    let data = new dataTopicEntity.DataTopic("KUSER/yeyeyeye/GROUPESAVING", "DELETE", "Group")
    let topic = "KOLA"

    notificationModule.sendMessageToTopicForSync(topic, data)
    res.send("sendNotificationToTopic");
});