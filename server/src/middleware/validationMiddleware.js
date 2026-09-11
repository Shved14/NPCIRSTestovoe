const {validationResult} = require('express-validator')
const ApiError = require('../error/ApiError')

module.exports = function validationMiddleware(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return next(
            ApiError.badRequest('Ошибка валидации данных', errors.array()
            )
        )
    }
    next()
}