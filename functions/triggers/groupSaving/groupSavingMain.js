const commonTrigger = require('../commonTrigger');

const GROUP_ENTITY_NAME = "GroupSaving"

const BANK_ENTITY_NAME = "Bank"

exports.listenGroup = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}", GROUP_ENTITY_NAME)

exports.listenBank = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}/BANKS/{bankId}", BANK_ENTITY_NAME)
