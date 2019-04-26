const formatValidationErrors = errors => {
    return Object.values(errors).map(e => ({
        status: 'Bad Request',
        code: '400',
        title: 'Validation Error',
        detail: e.message,
        source: {
            pointer: `/data/attributes/${e.path}`,
            value: e.value
        }
    }))
}




module.exports = (err, req, res, next) => {
    const isValidationError =
        err.hasOwnProperty('name') && err.name === 'ValidationError'

    const payload = isValidationError ? formatValidationErrors(err.errors) : err
    const code = isValidationError ? 400 : err.code || 500

    res.status(code).send({
        errors: payload
    })
}