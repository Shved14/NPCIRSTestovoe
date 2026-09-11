const ordersModel = require('../models/ordersModel')

class OrdersController {

    async create(req, res, next) {
        try {
            const {
                customer_id,
                title,
                order_date,
                amount,
                quantity,
            } = req.body

            const order = await ordersModel.create({
                customer_id,
                title,
                order_date,
                amount,
                quantity,
            })

            return res.status(201).json(order)
        } catch (error) {
            next(error)
        }
    }

    async getAll(req, res, next) {
        try {
            const limit = Number(req.query.limit) || 100
            const offset = Number(req.query.offset) || 0

            const orders = await ordersModel.getAll({
                limit,
                offset,
            })

            return res.json(orders)
        } catch (error) {
            next(error)
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params

            const order = await ordersModel.getById(id)

            if (!order) {
                return res.status(404).json({
                    error: 'Заказ не найден!',
                })
            }

            return res.json(order)
        } catch (error) {
            next(error)
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params

            const {
                customer_id,
                title,
                order_date,
                amount,
                quantity,
            } = req.body

            const order = await ordersModel.update(id, {
                customer_id,
                title,
                order_date,
                amount,
                quantity,
            })

            if (!order) {
                return res.status(404).json({
                    error: 'Заказ не найден',
                })
            }

            return res.json(order)
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params

            const deleted = await ordersModel.delete(id)

            if (!deleted) {
                return res.status(404).json({
                    error: 'Заказ ене найден',
                })
            }

            return res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new OrdersController()

