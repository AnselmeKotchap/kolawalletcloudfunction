const functions = require('firebase-functions');
const admin = require('firebase-admin');
const notif = require('../entities/Notification');


/********* NOTIFICATION FOR SYNCRONISATION ***************************/

/**
 * Function to send data to many user for synchronisation
 * @param topic topic to which users have subscribed : string
 * @param notification notification params : Notification
 * @param data data of the notification : DataTopic
 */
exports.sendMessageToTopicForSync = function (topic, notification, data) {
    let payload = {
        notification: { ...notification },
        data: { ...data }
    }

    return admin.messaging().sendToTopic(topic, payload)
        .then(function (response) {
            console.log("Successfully sent message:", response)
        })
        .catch(function (error) {
            console.log("Error sending message:", error);
        })
}


/**
 * Function to send data to one user for synchronisation
 * @param token devise token: string
 * @param notification notification params : Notification
 * @param data data of the notification : DataToken
 */
exports.sendMessageToTokenForSync = function (token, notification, data) {
    let payload = {
        notification: { ...notification },
        data: { ...data }
    }

    return admin.messaging().sendToDevice(token, payload)
        .then(function (response) {
            console.log("Successfully sent message:", response)
        })
        .catch(function (error) {
            console.log("Error sending message:", error);
        })
}


/********* NOTIFICATION FOR SYNCRONISATION ***************************/







/********* SIMPLE NOTIFICATION ***************************/

/**
 * Function to send simple notification to many user
 * @param topic topic to which users have subscribed : string
 * @param notification notification params : Notification
 */
exports.sendMessageToTopic = function (topic, notification) {
    let payload = {
        notification: { ...notification }
    }

    return admin.messaging().sendToTopic(topic, payload)
        .then(function (response) {
            console.log("Successfully sent message:", response)
        })
        .catch(function (error) {
            console.log("Error sending message:", error);
        })
}


/**
 * Function to send simple notification to one user
 * @param token devise token: string
 * @param notification notification params : Notification
 */
exports.sendMessageToToken = function (token, notification) {
    let payload = {
        notification: { ...notification }
    }

    return admin.messaging().sendToDevice(token, payload)
        .then(function (response) {
            console.log("Successfully sent message:", response)
        })
        .catch(function (error) {
            console.log("Error sending message:", error);
        })
}



/**
 * Function to send simple notification to all users
 * @param notification notification params : Notification
 */
exports.sendKolaMessageToAllUsers = function (title, body) {
    let kolaImage = "https://firebasestorage.googleapis.com/v0/b/kola-wallet-dev.appspot.com/o/FCMImages%2Fbitmoji-20190131055305.png?alt=media&token=cfe2f5b6-7ef9-4926-825d-ed600aea07eb"
    let notification = new notif.Notification(title, body, kolaImage)
    let payload = {
        notification: { ...notification }
    }

    return admin.messaging().sendToTopic("KOLA", payload)
        .then(function (response) {
            console.log("Successfully sent message:", response)
        })
        .catch(function (error) {
            console.log("Error sending message:", error);
        })
}

/********* SIMPLE NOTIFICATION ***************************/