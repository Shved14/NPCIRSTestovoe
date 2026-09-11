const Router = require('express')
const router = new Router()
const OrderController = require('../controllers/ordersController')


router.post('/', OrderController.create)
router.get('/', OrderController.getAll)
router.get('/:id', OrderController.getById)
router.put('/:id', OrderController.update)
router.delete('/:id', OrderController.delete)