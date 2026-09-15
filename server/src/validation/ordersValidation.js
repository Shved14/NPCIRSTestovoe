const {body, param, query} = require('express-validator')

const orderIdValidation = [param('id')
    .isInt({min: 1, max: 2147483647})
    .withMessage('Order ID должен быть положительным целым числом'),]

const getAllOrdersValidation = [query('limit')
    .optional()
    .isInt({min: 1, max: 100})
    .withMessage('Limit должен быть целым числом от 1 до 100'),

    query('offset')
        .optional()
        .isInt({min: 0, max: 2147483647})
        .withMessage('Offset должен быть целым числом от 0 до 2147483647'),]

const createOrderValidation = [body('customer_id')
    .isInt({min: 1, max: 2147483647})
    .withMessage('Customer_id должен быть положительным целым числом'),

    body('title')
        .optional({values: 'null'})
        .isString()
        .withMessage('Title должен быть строкой')
        .trim()
        .isLength({max: 200})
        .withMessage('Title не должен превышать 200 символов'),

    body('order_date')
        .isISO8601({strict: true})
        .toDate()
        .withMessage('Order_date должен быть корректной датой'),

    body('amount')
        .isDecimal({decimal_digits: '0,2'})
        .withMessage('Amount должен быть числом с максимум 2 знаками после запятой')
        .isFloat({min: 0, max: 99999999.99})
        .withMessage('Amount должен быть от 0 до 99999999.99'),

    body('quantity')
        .isInt({min: 1, max: 2147483647})
        .withMessage('Quantity должен быть целым числом от 1 до 2147483647'),]

const updateOrderValidation = [...orderIdValidation,

    body('customer_id')
        .isInt({min: 1, max: 2147483647})
        .withMessage('Customer_id должен быть положительным целым числом'),

    body('title')
        .optional({values: 'null'})
        .isString()
        .withMessage('Title должен быть строкой')
        .trim()
        .isLength({max: 200})
        .withMessage('Title не должен превышать 200 символов'),

    body('order_date')
        .isISO8601({strict: true})
        .toDate()
        .withMessage('Order_date должен быть корректной датой'),

    body('amount')
        .isDecimal({decimal_digits: '0,2'})
        .withMessage('Amount должен быть числом с максимум 2 знаками после запятой')
        .isFloat({min: 0, max: 99999999.99})
        .withMessage('Amount должен быть от 0 до 99999999.99'),

    body('quantity')
        .isInt({min: 1, max: 2147483647})
        .withMessage('Quantity должен быть целым числом от 1 до 2147483647'),]

module.exports = {
    orderIdValidation, getAllOrdersValidation, createOrderValidation, updateOrderValidation,
}