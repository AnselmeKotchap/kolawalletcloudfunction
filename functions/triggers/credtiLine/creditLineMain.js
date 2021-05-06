const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const utils = require('../../utils/utils');


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
        }

    });