const functions = require("firebase-functions")
const utils = require("../utils/utils")
const eventNotification = require("../utils/eventNotifications");
const notificationModule = require("../FCM/main");
const dataTopicEntity = require('../entities/DataTopic');
const dataTokenEntity = require('../entities/DataToken');
let admin = require('firebase-admin');
const db = admin.firestore();

const FCM_CREATE_METHODE = "CREATE"
const FCM_DELETE_METHODE = "DELETE"
const FCM_UPDATE_METHODE = "UPDATE"
const FCM_ADD_MEMBER_TO_GROUP_METHODE = "ADD_TO_GROUP"


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
                eventNotification.sendEvenNotification(path, className, FCM_UPDATE_METHODE)


                if (className == "GroupSMember") {
                    const dataBeforeChanges = change.before.data()
                    const dataAfterChanges = change.after.data()
                    let memberUserId = dataAfterChanges.userIdOfMember
                    let memberMaintPhoneNmber = dataAfterChanges.mainPhone

                    console.log("created data ->" + dataAfterChanges)
                    console.log("User Id Of Member ->" + memberUserId)
                    console.log("member auth phone number ->" + memberMaintPhoneNmber)

                    if (memberUserId != "") {
                        var phoneToFind = memberMaintPhoneNmber
                        if (phoneToFind.length == 13) {
                            phoneToFind = memberMaintPhoneNmber.substring(4) //TO remove +237
                        }

                        console.log("member Id is not empty: user phone without +237 ->" + phoneToFind)
                        console.log("member phoneList ->" + dataAfterChanges.phoneList)

                        if (dataBeforeChanges.phoneList.length != dataAfterChanges.phoneList.length) {
                            console.log("user phoneNumbers leng are updated");
                            findUserByPhoneNumberAndSendSyncToken(phoneToFind, path);
                        }
                    }
                }

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
                eventNotification.sendEvenNotification(path, className, FCM_DELETE_METHODE)

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
                eventNotification.sendEvenNotification(path, className, FCM_CREATE_METHODE)

                if (className == "GroupSMember") {
                    findUserByIdAndSendSyncToken(change, path);
                }
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
                const createdData = change.after.data()

                let memberUserId = createdData.userIdOfMember
                let memberMaintPhoneNmber = createdData.mainPhone

                console.log("created data ->" + createdData)
                console.log("member document Path-> " + path)
                console.log("User Id Of Member ->" + memberUserId)
                console.log("member auth phone number ->" + memberMaintPhoneNmber)

                if (memberUserId != "") {
                    let checkUserDoc = db.collection("KUSERS").doc(memberUserId).get();
                    return checkUserDoc.then(userDoc => {

                        if (!userDoc.exists) {
                            console.log("No such document! This user doens't have an account");
                        } else {

                            let userData = userDoc.data()
                            console.log("userData -> " + userData)
                            let usertokenToken = userData.cloudMessageToken
                            let groupId = utils.getGroupIdFromPath(path)

                            let groupPath = "GROUP_SAVING/" + groupId

                            let dataToken = new dataTokenEntity.DataToken(groupId, groupPath, "ADD_TO_GROUP", "GroupSaving")
                            console.log("Data topicToSubscribe -> " + dataToken.topicToSubscribe)
                            console.log("Data method -> " + dataToken.method)
                            console.log("Data entity -> " + dataToken.entity)
                            console.log("Token-> " + usertokenToken)

                            try {
                                notificationModule.sendMessageToTokenForSync(usertokenToken, dataToken)
                            } catch (error) {
                                console.log('Error getting document', error);
                            }
                        }
                    }).catch(err => {
                        console.log('Error getting document', err);
                        throw new functions.https.HttpsError('Error getting document', err);
                    })

                }
            }

        });
}

function findUserByIdAndSendSyncToken(change, path) {
    const createdData = change.after.data();
    let memberUserId = createdData.userIdOfMember;
    let memberMaintPhoneNmber = createdData.mainPhone;

    console.log("created data ->" + createdData);
    console.log("member document Path-> " + path);
    console.log("User Id Of Member ->" + memberUserId);
    console.log("member auth phone number ->" + memberMaintPhoneNmber);

    if (memberUserId != "") {
        let checkUserDoc = db.collection("KUSERS").doc(memberUserId).get();
        checkUserDoc.then(userDoc => {

            if (!userDoc.exists) {
                console.log("No such document! This user doens't have an account");
            } else {

                let userData = userDoc.data();
                console.log("userData -> " + userData);
                let usertokenToken = userData.cloudMessageToken;
                let groupId = utils.getGroupIdFromPath(path);

                let groupPath = "GROUP_SAVING/" + groupId;

                let dataToken = new dataTokenEntity.DataToken(groupId, groupPath, "ADD_TO_GROUP", "GroupSaving");
                console.log("Data topicToSubscribe -> " + dataToken.topicToSubscribe);
                console.log("Data method -> " + dataToken.method);
                console.log("Data entity -> " + dataToken.entity);
                console.log("Token-> " + usertokenToken);

                notificationModule.sendMessageToTokenForSync(usertokenToken, dataToken);
            }
        }).catch(err => {
            console.log('Error getting document', err);
            throw new functions.https.HttpsError('Error getting document', err);
        });

    }
}

function findUserByPhoneNumberAndSendSyncToken(membePhoneNmber, path) {
    console.log("phone of member to find: " + membePhoneNmber);

    let checkUserDoc = db.collection("KUSERS")
        .where('phoneNumbers', 'array-contains', membePhoneNmber)
        .get();

    checkUserDoc.then(snapshot => {
        if (snapshot.empty) {
            console.log("No such document! This user doens't have an account");
            return;
        }

        snapshot.forEach(userDoc => {
            console.log(userDoc.id, '=>', userDoc.data());
            let userData = userDoc.data();
            console.log("userData -> " + userData);
            console.log("userData authphone -> " + userData.authPhoneNumber);

            let usertokenToken = userData.cloudMessageToken;
            let groupId = utils.getGroupIdFromPath(path);

            let groupPath = "GROUP_SAVING/" + groupId;

            try {
                let dataToken = new dataTokenEntity.DataToken(groupId, groupPath, "ADD_TO_GROUP", "GroupSaving");
                console.log("Data topicToSubscribe -> " + dataToken.topicToSubscribe);
                console.log("Data method -> " + dataToken.method);
                console.log("Data entity -> " + dataToken.entity);
                console.log("Token-> " + usertokenToken);

                notificationModule.sendMessageToTokenForSync(usertokenToken, dataToken);
            } catch (e) {
                console.log(e);
            }
        });

    }).catch(err => {
        console.log('Error getting document', err);
        throw new functions.https.HttpsError('Error getting document', err);
    });
}
