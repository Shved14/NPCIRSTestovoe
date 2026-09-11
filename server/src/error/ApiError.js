class ApiError extends Error{
    constructor(status,message, details = null) {
        super(message);
        this.status = status
        this.details = details
        this.message = message

        Error.captureStackTrace(this, this.constructor)
    }

    static badRequest(message = 'Некорректный запрос', details = null){
        return new ApiError(400,message, details)
    }

    static forbidden(message= 'Доступ запрещен'){
        return new ApiError(403,message)
    }

    static notFound(message= 'Ресурс не найден'){
        return new ApiError(404,message)
    }

    static conflict(message= 'Конфликт данных'){
        return new ApiError(409,message)
    }

    static internal(message= 'Ошибка сервера'){
        return new ApiError(500,message)
    }
}
module.exports = ApiError