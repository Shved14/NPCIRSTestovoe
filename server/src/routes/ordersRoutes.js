const Router = require('express')
const router = new Router()

const ordersController = require('../controllers/ordersController')
const validationMiddleware = require('../middleware/validationMiddleware')

const {
    orderIdValidation,
    getAllOrdersValidation,
    createOrderValidation,
    updateOrderValidation,
    }
    = require('../validation/ordersValidation')

router.post('/', createOrderValidation, validationMiddleware, ordersController.create)
router.get('/', getAllOrdersValidation, validationMiddleware, ordersController.getAll)
router.get('/:id', orderIdValidation, validationMiddleware, ordersController.getById)
router.put('/:id', updateOrderValidation, validationMiddleware, ordersController.update)
router.delete('/:id', orderIdValidation, validationMiddleware, ordersController.delete)

module.exports = router