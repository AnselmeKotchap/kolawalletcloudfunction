const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const fs = require('fs-extra');
const gcs = require('@google-cloud/storage');

const path = require('path');
const os = require('os');

const json2csv = require('json2csv');

const db = admin.firestore()

exports.obServeNewUser = functions
    .firestore.document("KUSERS/{userId}")
    .onCreate((snap, context) => {

        //get user data
        const newuseobj = snap.data();
        var userId = newuseobj.userUid
        var authPhoneNumber = newuseobj.authPhoneNumber

        var selectedDocument = ""
        var authPhoneWithoutPlus237 = authPhoneNumber.substring(4)

        if (isOrangePhoneNumber(authPhoneWithoutPlus237)) {
            selectedDocument = "ORANGE_MONEY"
        }
        else if (isMTNPhoneNumber(authPhoneWithoutPlus237)) {
            selectedDocument = "MTN_MONEY"
        } else {
            selectedDocument = "UNKNOWOPERATOR"
        }

        return db.collection("PHONENUMBERS_AND_DETECTED_NAMES")
            .doc(selectedDocument)
            .collection("DETECTED_NAMES")
            .doc(authPhoneWithoutPlus237)
            .set({
                userUid: userId,
                phoneNumber: authPhoneWithoutPlus237
            }, { merge: true })
            .then(() => {
                console.log("New user Id saved in detectedName collection: Id: $useuserUid, phoneNumber: $authPhoneWithoutPlus237")
                return;
            })
            .catch((error) => {
                console.error("Error to saveuser Id saved in detectedName collection: Id: $useuserUid, phoneNumber: $authPhoneWithoutPlus237")
            });


    });

function isOrangePhoneNumber(phonenumber) {
    const regexOrange = /6(9([0-9])|5([5-9]))[0-9]{6}$/;
    return phonenumber.match(regexOrange)
}

function isMTNPhoneNumber(phonenumber) {
    const regexMTN = /6(7([0-9])|(8|5)([0-4]))[0-9]{6}$/
    return phonenumber.match(regexMTN)
}

/*
exports.createCSV = functions.firestore
    .document('KUSERS/{userId}/USER_SMS/{smsId}')
    .onUpdate((change, context) => {

        const data = change.after.id
        // Step 1. Set main variables


        //const reportId = event.params.reportId;
        //const fileName = `reports/${reportId}.csv`;

        const fileName = `reports/new_report.csv`;
        const tempFilePath = path.join(os.tmpdir(), fileName);


        // Reference report in Firestore
        const db = admin.firestore()
       // const reportRef = db.collection('reports').doc(reportId)

        // Reference Storage Bucket
        const storage =  admin.storage().bucket();


        // Step 2. Query collection
        return db.collectionGroup('USER_SMS')
                 .get()
                 .then(querySnapshot => {

                    /// Step 3. Creates CSV file from with transactionSms collection
                    const transactionSms = []

                    // create array of transactionSms data
                    querySnapshot.forEach(doc => {
                        transactionSms.push( doc.data() )
                    });


                    return json2csv({ data: transactionSms });
                 })
                .then(csv => {
                    // Step 4. Write the file to cloud function tmp storage
                    return fs.outputFile(tempFilePath, csv);
                })
                .then(() => {
                    // Step 5. Upload the file to Firebase cloud storage
                    return storage.upload(tempFilePath, { destination: fileName })
                })
                .then(file => {
                    // Step 6. Update status to complete in Firestore

                    return reportRef.update({ status: 'complete' })
                })
                .catch(err => console.log(err) )

});


exports.createCSV_for_sms = functions.firestore
    .document('KUSERS/{userId}/USER_SMS/{smsId}')
    .onUpdate((change, context) => {

        const data = change.after.id
        // Step 1. Set main variables


        //const reportId = event.params.reportId;
        //const fileName = `reports/${reportId}.csv`;

        const fileName = `reports/new_report_sms.csv`;
        const tempFilePath = path.join(os.tmpdir(), fileName);


        // Reference report in Firestore
        const db = admin.firestore()
       // const reportRef = db.collection('reports').doc(reportId)

        // Reference Storage Bucket
        const storage =  admin.storage().bucket();


        // Step 2. Query collection
        return db.collectionGroup('USER_SMS')
                 .get()
                 .then(querySnapshot => {

                    /// Step 3. Creates CSV file from with transactionSms collection
                    const transactionSms = []

                    // create array of transactionSms data
                    querySnapshot.forEach(doc => {
                        transactionSms.push( doc.data().custumSMSObjet.originalMessage )
                    });


                    return json2csv({ data: transactionSms });
                 })
                .then(csv => {
                    // Step 4. Write the file to cloud function tmp storage
                    return fs.outputFile(tempFilePath, csv);
                })
                .then(() => {
                    // Step 5. Upload the file to Firebase cloud storage
                    return storage.upload(tempFilePath, { destination: fileName })
                })
                .then(file => {
                    // Step 6. Update status to complete in Firestore

                    return reportRef.update({ status: 'complete' })
                })
                .catch(err => console.log(err) )

})

*/




