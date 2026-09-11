const customersModel = require('../models/customersModel')
const ApiError = require('../error/ApiError')

class CustomersController {
    async create(req, res, next) {
        try {
            const {
                name,
                registered_on,
                credit_limit,
            } = req.body

            const customer = await customersModel.create({
                name,
                registered_on,
                credit_limit,
            })

            return res.status(201).json(customer)
        } catch (error) {
            next(error)
        }
    }

    async getAll(req, res, next) {
        try {
            const limit = Number(req.query.limit) || 100
            const offset = Number(req.query.offset) || 0

            const customers = await customersModel.getAll({
                limit,
                offset,
            })

            return res.json(customers)
        } catch (error) {
            next(error)
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params

            const customer = await customersModel.getById(id)

            if (!customer) {
                return next(ApiError.notFound('Customer not found'))
            }

            return res.json(customer)
        } catch (error) {
            next(error)
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params

            const {
                name,
                registered_on,
                credit_limit,
            } = req.body

            const customer = await customersModel.update(id, {
                name,
                registered_on,
                credit_limit,
            })

            if (!customer) {
                return next(ApiError.notFound('Customer not found'))
            }

            return res.json(customer)
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params

            const deleted = await customersModel.delete(id)

            if (!deleted) {
                return next(ApiError.notFound('Customer not found'))
            }

            return res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CustomersController()