const ordersModel = require('../models/ordersModel')
const ApiError = require('../error/ApiError')

class OrdersController {

    async create(req, res, next) {
        try {
            const {
                customer_id, title, order_date, amount, quantity,
            } = req.body

            const order = await ordersModel.create({
                customer_id, title, order_date, amount, quantity,
            })

            return res.status(201).json(order)
        } catch (error) {
            return next(error)
        }
    }

    async getAll(req, res, next) {
        try {
            const limit = req.query.limit !== undefined ? Number(req.query.limit) : 100

            const offset = req.query.offset !== undefined ? Number(req.query.offset) : 0

            const orders = await ordersModel.getAll({
                limit, offset,
            })

            return res.json(orders)
        } catch (error) {
            return next(error)
        }
    }

    async getById(req, res, next) {
        try {
            const {id} = req.params

            const order = await ordersModel.getById(id)

            if (!order) {
                return next(ApiError.notFound('Order not found'))
            }

            return res.json(order)
        } catch (error) {
            return next(error)
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params

            const {
                customer_id, title, order_date, amount, quantity,
            } = req.body

            const order = await ordersModel.update(id, {
                customer_id, title, order_date, amount, quantity,
            })

            if (!order) {
                return next(ApiError.notFound('Order not found'))
            }

            return res.json(order)
        } catch (error) {
            return next(error)
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params

            const deleted = await ordersModel.delete(id)

            if (!deleted) {
                return next(ApiError.notFound('Order not found'))
            }

            return res.status(204).send()
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = new OrdersController()

