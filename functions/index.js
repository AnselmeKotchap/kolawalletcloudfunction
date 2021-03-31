const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const utils = require('./utils');


exports.obServeNewUser = functions
    .firestore.document("KUSERS/{userId}")
    .onCreate((snap, context) => {

        //get user data
        const newuseobj = snap.data();
        var userId = newuseobj.userUid
        var authPhoneNumber = newuseobj.authPhoneNumber

        var selectedDocument = ""
        var authPhoneWithoutPlus237 = authPhoneNumber.substring(4)

        if (utils.isOrangePhoneNumber(authPhoneWithoutPlus237)) {
            selectedDocument = "ORANGE_MONEY"
        }
        else if (utils.isMTNPhoneNumber(authPhoneWithoutPlus237)) {
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



