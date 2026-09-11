const { body, param, query } = require('express-validator')

const customerIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Customer ID должен быть положительным целым числом'),
]

const getAllCustomersValidation = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit должен быть целым числом от 1 до 100'),

    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset должен быть целым числом не меньше 0'),
]

const createCustomerValidation = [
    body('name')
        .isString()
        .withMessage('Name должен быть строкой')
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Name должен содержать от 1 до 30 символов'),

    body('registered_on')
        .isISO8601()
        .withMessage('Registered_on должен быть корректной датой'),

    body('credit_limit')
        .isDecimal()
        .withMessage('Credit_limit должен быть числом'),
]

const updateCustomerValidation = [
    ...customerIdValidation,

    body('name')
        .isString()
        .withMessage('Name должен быть строкой')
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Name должен содержать от 1 до 30 символов'),

    body('registered_on')
        .isISO8601()
        .withMessage('Registered_on должен быть корректной датой'),

    body('credit_limit')
        .isDecimal()
        .withMessage('Credit_limit должен быть числом'),
]

module.exports = {
    customerIdValidation,
    getAllCustomersValidation,
    createCustomerValidation,
    updateCustomerValidation,
}