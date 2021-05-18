const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const utils = require('../../utils/utils');
const notificationModule = require("../../FCM/main");
const dataAirtimeCreditRequest = require('../../entities/DataAirtimeCreditRequest');


exports.obServeAirtimeCreditRequest = functions
    .firestore.document("KUSERS/{userId}/AIRTIME_CREDIT_LINE/{creditLineId}/AIRTIME_CREDIT_REQUEST/{requestId}")
    .onWrite((change, context) => {
        if (change.before.exists && change.after.exists) {
            // update event
            console.log("********* UPDATE *****************")
            let docRef = change.after.ref
            let path = docRef.path

        } else if (!change.after.exists) {
            //delete event
            console.log("********* DELETE *****************")
            let docRef = change.before.ref
            let path = docRef.path

        } else {
            //add event
            console.log("********* CREATE *****************")
            let docRef = change.after.ref
            let path = docRef.path
            let requestId = docRef.id
            let data = change.after.data()

            let userScore = data.score

            if (userScore >= 580) {
                let query = db.collection("GATEWAYS").where('gateWayIsAvailable', '==', true).get();

                query.then(snapshot => {
                    if (!snapshot.empty) {
                        // The user is prevented from being able to cancel the request
                        docRef.update({
                            cancelable: false
                        })

                        // Gateway is available
                        snapshot.forEach(doc => {
                            let gateWay = doc.data()
                            let request = new dataAirtimeCreditRequest.DataAirtimeCreditRequest(requestId, path, doc.id, "" + { ...data })
                            notificationModule.sendMessageToTokenForSync(gateWay.token, request)

                            console.log("requestId -> " + request.requestId)
                            console.log("path -> " + request.path)
                            console.log("gateWayId -> " + request.gateWayId)
                            console.log("data -> " + request.data)
                            return
                        })
                    } else {
                        // Gateway is not available, we reject the request
                        docRef.update({
                            requestEnable: true,
                            status: 'REJECTED',
                            reasonOfReject: 'The service is unavailable, please try again later'
                        })

                        console.log("request rejected")
                    }
                }).catch(err => {
                    console.log('Error getting data', err);
                    throw new functions.https.HttpsError('Error getting document', err);
                })
            } else {
                // User score is bad, we reject the request
                docRef.update({
                    requestEnable: true,
                    status: 'REJECTED',
                    reasonOfReject: 'You are not eligible for this service. Continue to use Kola wallet to improve your score'
                })

                console.log("request rejected")
            }
        }

    });