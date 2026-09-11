const Router = require('express')
const router = new Router()
const ordersRoutes = require('./ordersRoutes')
const customersRoutes = require('./customersRoutes')

router.use('/orders', ordersRoutes)
router.use('/customers', customersRoutes)

module.exports = router