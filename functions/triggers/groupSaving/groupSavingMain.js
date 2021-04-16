const commonTrigger = require('../commonTrigger');


exports.listenGroup = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}", "GroupSaving")

exports.listenTontine = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}/TONTINES/{tontineId}", "Tontine")
//exports.listenTontine = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}/TONTINES/{tontineId}", "Tontine")

exports.listenTontineCycle = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}/TONTINES/{tontineId}/TONTINE_CYCLE_COLLECTION/{tontineCycleId}", "TontineCycle")
exports.listenTontineSession = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}/TONTINES/{tontineId}/TONTINE_CYCLE_COLLECTION/{tontineCycleId}/TONTINE_SESSIONS/{sessionId}", "SessionTontine")

exports.listenTontineSessionBeneficiary = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}/TONTINES/{tontineId}/TONTINE_CYCLE_COLLECTION/{tontineCycleId}/TONTINE_SESSIONS/{sessionId}/BENEFICIARY_COLLECTION/{beneficiaryId}", "Beneficiary")
exports.listenTontineSessioncontribution = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}/TONTINES/{tontineId}/TONTINE_CYCLE_COLLECTION/{tontineCycleId}/TONTINE_SESSIONS/{sessionId}/CONTRIBUTIONS_TONTINES/{contributionId}", "Contribution")


exports.listenBank = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}/BANKS/{bankId}", "Bank")
exports.listenBankDeposit = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}/BANKS/{bankId}/BANK_DEPOSITS_COLLECTION/{BankDepositId}", "Deposit")
exports.listenBankWithdrawal = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}/BANKS/{bankId}/BANK_WITHDRAWALS/{BankWithdrawalId}", "WithdrawalBank")
exports.listenBankLoan = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}/BANKS/{bankId}/BANK_LOANS/{BankLoanId}", "LoanBank")



exports.listenCampaign = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}/CAMPAIGNS/{campaignId}", "Campaign")
exports.listenCampaignContribution = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}/CAMPAIGNS/{campaignId}/CAMPAIGN_CONTRIBUTIONS/{campContributionId}", "CampaignContribution")
exports.listenCampaignWithdrawal = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}/CAMPAIGNS/{campaignId}/CAMPAIGN_WITHDRAWALS/{campWithdrawalId}", "WithdrawalCampaign")


exports.listenPictureGroup = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}/GROUP_PICTURES/{groupPictureId}", "PictureGroup")

exports.listenAnnoucement = commonTrigger.onWriteTrigger("GROUP_SAVING/{groupId}/ANNOUNCEMENT_COLLECTION/{announcementId}", "AnnouncementGroup")


exports.onWriteMember = commonTrigger.onWriteMemberTrigger("GROUP_SAVING/{groupId}/MEMBERS_COLLECTION/{memberId}", "GroupSMember")

