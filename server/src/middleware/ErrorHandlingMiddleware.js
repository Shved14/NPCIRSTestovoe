const ApiError = require('../error/ApiError')
const {
    ForeignKeyConstraintError, ValidationError, UniqueConstraintError, DatabaseError,
} = require('sequelize')

module.exports = function errorHandlingMiddleware(err, req, res, next) {
    if (err instanceof ApiError) {
        const response = {
            message: err.message,
        }

        if (err.details) {
            response.details = err.details
        }

        return res.status(err.status).json(response)
    }

    if (err instanceof UniqueConstraintError) {
        return res.status(409).json({
            message: 'Запись с такими данными уже существует',
        })
    }

    if (err instanceof ForeignKeyConstraintError) {
        if (req.method === 'DELETE' && req.originalUrl.startsWith('/api/customers/')) {
            return res.status(409).json({
                message: 'Нельзя удалить покупателя, пока у него есть заказы',
            })
        }

        return res.status(400).json({
            message: 'Указанный покупатель не существует',
        })
    }

    if (err instanceof ValidationError) {
        return res.status(400).json({
            message: 'Ошибка валидации данных', details: err.errors.map((error) => ({
                field: error.path, message: error.message,
            })),
        })
    }

    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            message: 'Размер запроса слишком большой',
        })
    }

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: 'Некорректный JSON',
        })
    }

    if (err instanceof DatabaseError) {
        console.error('Ошибка БД:', err)

        return res.status(500).json({
            message: 'Ошибка БД',
        })
    }

    console.error('Непредвиденная ошибка:', err)

    return res.status(500).json({
        message: 'Внутренняя ошибка сервера!',
    })
}