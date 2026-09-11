const { body, param, query } = require('express-validator')

const orderIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Order ID должен быть положительным целым числом'),
]

const getAllOrdersValidation = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit должен быть целым числом от 1 до 100'),

    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset должен быть целым числом не меньше 0'),
]

const createOrderValidation = [
    body('customer_id')
        .isInt({ min: 1 })
        .withMessage('Customer_id должен быть положительным целым числом'),

    body('title')
        .optional({ values: 'null' })
        .isString()
        .withMessage('Title должен быть строкой')
        .trim()
        .isLength({ max: 200 })
        .withMessage('Title не должен превышать 200 символов'),

    body('order_date')
        .isISO8601()
        .withMessage('Order_date должен быть корректной датой'),

    body('amount')
        .isDecimal()
        .withMessage('Amount должен быть числом'),

    body('quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity должен быть целым числом больше 0'),
]

const updateOrderValidation = [
    ...orderIdValidation,

    body('customer_id')
        .isInt({ min: 1 })
        .withMessage('Customer_id должен быть положительным целым числом'),

    body('title')
        .optional({ values: 'null' })
        .isString()
        .withMessage('Title должен быть строкой')
        .trim()
        .isLength({ max: 200 })
        .withMessage('Title не должен превышать 200 символов'),

    body('order_date')
        .isISO8601()
        .withMessage('Order_date должен быть корректной датой'),

    body('amount')
        .isDecimal()
        .withMessage('Amount должен быть числом'),

    body('quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity должен быть целым числом больше 0'),
]

module.exports = {
    orderIdValidation,
    getAllOrdersValidation,
    createOrderValidation,
    updateOrderValidation,
}