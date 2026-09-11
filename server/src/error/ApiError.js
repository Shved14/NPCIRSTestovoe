class ApiError extends Error{
    constructor(status,message) {
        super(message);
        this.status = status
        this.message = message

        Error.captureStackTrace(this.constructor)
    }

    static badRequest(message = 'Некорректный запрос'){
        return new ApiError(400,message)
    }

    static forbidden(message= 'Доступ запрещен'){
        return new ApiError(403,message)
    }

    static notfound(message= 'Ресурс не найден'){
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