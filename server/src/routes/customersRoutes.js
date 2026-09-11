const Router = require('express')
const router = new Router()
const CustomerController = require('../controllers/customersController')


router.post('/', CustomerController.create)
router.get('/', CustomerController.getAll)
router.get('/:id', CustomerController.getById)
router.put('/:id', CustomerController.update)
router.delete('/:id', CustomerController.delete)