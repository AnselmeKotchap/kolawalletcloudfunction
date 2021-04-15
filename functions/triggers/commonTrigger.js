const functions = require("firebase-functions")
const utils = require("../utils/utils")
const notificationModule = require("../FCM/main")
const dataTopicEntity = require('../entities/DataTopic');
const dataTokenEntity = require('../entities/DataToken');


exports.onWriteTrigger = function (documentRefPath, className) {
    return functions.firestore
        .document(documentRefPath)
        .onWrite((change, context) => {
            console.log("############## documentRefPath-> " + documentRefPath + " ##############")
            console.log("############## className-> " + className + " ##############")
            if (change.before.exists && change.after.exists) {
                // update event
                console.log("********* UPDATE *****************")
                let docRef = change.after.ref
                let path = docRef.path
                let data = new dataTopicEntity.DataTopic(path, "UPDATE", className)

                let topic = utils.getGroupIdFromPath(path)

                console.log("Document Path-> " + path)
                console.log("Topic-> " + topic)
                console.log("Data path -> " + data.path)
                console.log("Data method -> " + data.method)
                console.log("Data entity -> " + data.entity)
                notificationModule.sendMessageToTopicForSync(topic, data)

            } else if (!change.after.exists) {
                //delete event
                console.log("********* DELETE *****************")
                let docRef = change.before.ref
                let path = docRef.path
                let data = new dataTopicEntity.DataTopic(path, "DELETE", className)
                let topic =  utils.getGroupIdFromPath(path)

                console.log("Document Path-> " + path)
                console.log("Topic-> " + topic)
                console.log("Data path -> " + data.path)
                console.log("Data method -> " + data.method)
                console.log("Data entity -> " + data.entity)
                notificationModule.sendMessageToTopicForSync(topic, data)
            } else {
                //add event
                console.log("********* CREATE *****************")
                let docRef = change.after.ref
                let path = docRef.path
                let data = new dataTopicEntity.DataTopic(path, "CREATE", className)
                let topic =  utils.getGroupIdFromPath(path)

                console.log("Document Path-> " + path)
                console.log("Topic-> " + topic)
                console.log("Data path -> " + data.path)
                console.log("Data method -> " + data.method)
                console.log("Data entity -> " + data.entity)
                notificationModule.sendMessageToTopicForSync(topic, data)
            }

        });
}


exports.onWriteMemberTrigger = function (documentRefPath, className) {
    return functions.firestore.document(documentRefPath)
    .onWrite((change, context) => {
        console.log("############## documentRefPath-> " + documentRefPath + " ##############")
        console.log("############## className-> " + className + " ##############")
        if (change.before.exists && change.after.exists) {
            // update event
            console.log("********* UPDATE *****************")
            let docRef = change.after.ref
            let path = docRef.path
            let data = new dataTopicEntity.DataTopic(path, "UPDATE", className)
            let topic = utils.getGroupIdFromPath(path)

            console.log("Document Path-> " + path)
            console.log("Topic-> " + topic)
            console.log("Data path -> " + data.path)
            console.log("Data method -> " + data.method)
            console.log("Data entity -> " + data.entity)
            notificationModule.sendMessageToTopicForSync(topic, data)

        } else if (!change.after.exists) {
            //delete event
            console.log("********* DELETE *****************")
            let docRef = change.before.ref
            let path = docRef.path
            let data = new dataTopicEntity.DataTopic(path, "DELETE", className)
            let topic = utils.getGroupIdFromPath(path)

            console.log("Document Path-> " + path)
            console.log("Topic-> " + topic)
            console.log("Data path -> " + data.path)
            console.log("Data method -> " + data.method)
            console.log("Data entity -> " + data.entity)
            notificationModule.sendMessageToTopicForSync(topic, data)
        } else {
            //add event
            console.log("********* CREATE *****************")
            let docRef = change.after.ref
            let path = docRef.path
            let data = new dataTokenEntity.DataToken(path, "CREATE", className)
            let memberUserId = context.params.userIdOfMember
            let memberMaintPhoneNmber =context.params.mainPhone
            let token = memberUserId

            console.log("Document Path-> " + path)
            console.log("Token-> " + token)
            console.log("Data path -> " + data.path)
            console.log("Data method -> " + data.method)
            console.log("Data entity -> " + data.entity)
            console.log("New member authPhoneNumber ->"+memberUserId)
            console.log("New member user Id ->"+memberMaintPhoneNmber)

            notificationModule.sendMessageToTokenForSync(token, data)
        }

    });
}