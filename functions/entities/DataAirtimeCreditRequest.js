exports.DataAirtimeCreditRequest = class {
    constructor(requestId, path, gateWayId, data) {
        this.requestId = requestId
        this.path = path
        this.gateWayId = gateWayId
        this.data = data
    }
}