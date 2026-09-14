const {body, param, query} = require('express-validator')

const customerIdValidation = [
    param('id')
        .isInt({min: 1})
        .withMessage('Customer ID должен быть положительным целым числом'),
]

const getAllCustomersValidation = [
    query('limit')
        .optional()
        .isInt({min: 1, max: 100})
        .withMessage('Limit должен быть целым числом от 1 до 100'),

    query('offset')
        .optional()
        .isInt({min: 0, max: 2147483647})
        .withMessage('Offset должен быть целым числом от 0 до 2147483647'),
]

const createCustomerValidation = [
    body('name')
        .isString()
        .withMessage('Name должен быть строкой')
        .trim()
        .isLength({min: 1, max: 30})
        .withMessage('Name должен содержать от 1 до 30 символов'),

    body('registered_on')
        .isISO8601({strict: true})
        .withMessage('Registered_on должен быть корректной датой'),

    body('credit_limit')
        .isDecimal({decimal_digits: '0,2'})
        .withMessage('Credit_limit должен быть числом с максимум двумя знаками после запятой')
        .isFloat({min: 0, max: 99999999.99})
        .withMessage('Credit_limit должен быть от 0 до 99999999.99'),

    body('priority')
        .isInt({min: 1})
        .withMessage('Priority должен быть целым числом не меньше 1'),
]

const updateCustomerValidation = [
    ...customerIdValidation,

    body('name')
        .isString()
        .withMessage('Name должен быть строкой')
        .trim()
        .isLength({min: 1, max: 30})
        .withMessage('Name должен содержать от 1 до 30 символов'),

    body('registered_on')
        .isISO8601({strict: true})
        .withMessage('Registered_on должен быть корректной датой'),

    body('credit_limit')
        .isDecimal({decimal_digits: '0,2'})
        .withMessage('Credit_limit должен быть числом с максимум двумя знаками после запятой')
        .isFloat({min: 0, max: 99999999.99})
        .withMessage('Credit_limit должен быть от 0 до 99999999.99'),

    body('priority')
        .isInt({min: 1})
        .withMessage('Priority должен быть целым числом не меньше 1'),
]

module.exports = {
    customerIdValidation,
    getAllCustomersValidation,
    createCustomerValidation,
    updateCustomerValidation,
}