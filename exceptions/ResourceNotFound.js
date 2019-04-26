class ResourceNotFoundException extends Error {
    constructor(...args) {
        super(...args)
        Error.captureStackTrace(this, ResourceNotFoundException)
        this.status = 'Not found'
        this.code = '404'
        this.title = 'Resource does not exist'
        this.description = this.message
    }
}

module.exports = ResourceNotFoundException