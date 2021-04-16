const functions = require("firebase-functions")
const utils = require("../utils/utils")
const notificationModule = require("../FCM/main")
const dataTopicEntity = require('../entities/DataTopic');
const dataTokenEntity = require('../entities/DataToken');
let admin = require('firebase-admin');
const db = admin.firestore();


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
                let data = new dataTopicEntity.DataTopic(path, "CREATE", className)
                let topic = utils.getGroupIdFromPath(path)

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
                const createdData  = change.after.data()

                let memberUserId =createdData.userIdOfMember
                let memberMaintPhoneNmber = createdData.mainPhone

                console.log("created data ->" + createdData)
                console.log("member document Path-> " + path)
                console.log("User Id Of Member ->" + memberUserId)
                console.log("member auth phone number ->" + memberMaintPhoneNmber)

                if (memberUserId != "") {
                    const checkUserDoc = db.collection("KUSERS").doc(memberUserId).get();
                    return checkUserDoc.then(userDoc => {

                        if (!userDoc.exists) {
                            console.log("No such document! This user doens't have an account");
                        } else {

                            const userData = userDoc.data()
                            console.log("userData -> " + userData)
                            const usertokenToken = userData.cloudMessageToken
                            const groupId = userData.groupId
                            const groupPath = "GROUP_SAVING/"+groupId

                            let dataToken = new dataTokenEntity.DataToken(groupId, groupPath, "CREATE", "GroupSaving")
                            console.log("Data method -> " + dataToken.topicToSubscribe)
                            console.log("Data method -> " + dataToken.method)
                            console.log("Data entity -> " + dataToken.entity)
                            console.log("Token-> " + usertokenToken)

                            notificationModule.sendMessageToTokenForSync(usertokenToken, dataToken)
                        }
                    }).catch(err => {
                        console.log('Error getting document', err);
                        throw new functions.https.HttpsError('Error getting document', err);
                    })

                }
            }

        });
}