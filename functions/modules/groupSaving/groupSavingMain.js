const functions = require("firebase-functions")
const utils = require("../../utils/utils")
require("../../utils/Constants")
const notificationModule = require("../../FCM/main")
const dataTopicEntity = require('../../entities/DataTopic');
const dataTokenEntity = require('../../entities/DataToken');

const GROUP_ENTITY_NAME = "GroupSaving"

exports.listenGroup = functions.firestore
    .document("GROUP_SAVING/{groupId}")
    .onWrite((change, contex) => {

        if (change.before.exists && change.after.exists) {
            // update event
            console.log("********* UPDATE *****************")
            let docRef = change.after.ref
            let path = docRef.path
            let data = new dataTopicEntity.DataTopic(path, "UPDATE", GROUP_ENTITY_NAME)
            let topic = docRef.id

            console.log("Document Path-> " + path)
            console.log("Topic-> " + topic)
            console.log("Data-> " + { ...data })
            //notificationModule.sendMessageToTopicForSync(topic, data)

        } else if (!change.after.exists) {
            //delete event
            console.log("********* DELETE *****************")
            let docRef = change.before.ref
            let path = docRef.path
            let data = new dataTopicEntity.DataTopic(path, "DELETE", GROUP_ENTITY_NAME)
            let topic = docRef.id

            console.log("Document Path-> " + path)
            console.log("Topic-> " + topic)
            console.log("Data-> " + { ...data })
            //notificationModule.sendMessageToTopicForSync(topic, data)
        } else {
            //add event
            console.log("********* CREATE *****************")
        }

    });


