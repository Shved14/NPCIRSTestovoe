const Router = require('express')
const router = new Router()

const customersController = require('../controllers/customersController')
const validationMiddleware = require('../middleware/validationMiddleware')

const {
    customerIdValidation,
    getAllCustomersValidation,
    createCustomerValidation,
    updateCustomerValidation,
    }
    = require('../validation/customersValidation')

router.post('/', createCustomerValidation, validationMiddleware, customersController.create)
router.get('/', getAllCustomersValidation, validationMiddleware, customersController.getAll)
router.get('/:id', customerIdValidation, validationMiddleware, customersController.getById)
router.put('/:id', updateCustomerValidation, validationMiddleware, customersController.update)
router.delete('/:id', customerIdValidation, validationMiddleware, customersController.delete)

module.exports = router