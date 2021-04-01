/**
 * In this file we load all the modules
 */


const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Test module, to remove
exports.test = require('./test');


// User module
exports.userMain = require('./modules/user/userMain');


// Group saving module
exports.groupSavingMain = require('./modules/groupSaving/groupSavingMain');