exports.DataToken = class {
    constructor(topicToSubscribe, path, method, entity) {
        this.topicToSubscribe = topicToSubscribe
        this.path = path
        this.method = method
        this.entity = entity
    }
}