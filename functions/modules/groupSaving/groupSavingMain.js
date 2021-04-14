const functions = require("firebase-functions")
const utils = require("../../utils/utils")
const constants = require("../../utils/Constants")
const notification = require("../../FCM/main")

exports.listenGroup = functions.firestore
    .document("GROUP_SAVING/{groupId}")
    .onWrite((change, contex) => {

        if (change.before.existes()) {
            // update event
            return
        } else if (!change.after.exists()) {
            //delete event
            return null;
        } else {
            //add event
        }

    });


function processCreate(change) {

    let documentPath = change.ref.path()
    console.log("Document Path" + documentPath);

    let data = new dataTopicEntity.DataTopic(documentPath, constants.CREATE, "GroupSaving")
    let topic = "KOLA"

    notificationModule.sendMessageToTopicForSync(topic, data)

}


