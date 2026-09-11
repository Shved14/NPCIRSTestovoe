const ApiError = require('../error/ApiError')
const {Validation, ForeignKeyConstraintError, ValidationError} = require('sequelize')

module.exports = function (err, req, res,next){
    console.log(err)
    if(err instanceof ApiError){
        return  res.status(err.status).json({message: err.message})
    }

    if(err instanceof ValidationError){
        return  res.status(400).json({
            message:'Ошибка валидации данных',
            errors: err.errors.map((error) => ({
                field: error.path,
                message: error.message,
            })),
        })
    }
    if(err instanceof ForeignKeyConstraintError){
        return  res.status(400).json({
            message:'Указанный покупатель не существует',
        })
    }

    if(err instanceof SyntaxError && err.status === 400 && 'body' in err){
        return  res.status(400).json({
            message:'Некорректный Json',
        })
    }

    return res.status(500).json({
        message: "Непридвиденная ошибка!"
    })
}