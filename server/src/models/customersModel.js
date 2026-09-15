const {QueryTypes} = require('sequelize')
const {Customers} = require('./models')
const sequelize = require('../db/db')

class CustomersModel {

    async create({
                     name, registered_on, credit_limit, priority,
                 }) {
        return Customers.create({
            name, registered_on, credit_limit, priority,
        })
    }

    async getById(id) {
        return Customers.findByPk(id)
    }

    async getAll({limit, offset}) {
        const rows = await sequelize.query(`
            SELECT
                id,
                name,
                registered_on,
                credit_limit,
                priority
            FROM customers
            ORDER BY id ASC
            LIMIT :limit
            OFFSET :offset
            `, {
            replacements: {
                limit, offset,
            }, type: QueryTypes.SELECT,
        })

        const countRows = await sequelize.query(`
            SELECT COUNT(*) AS total
            FROM customers
            `, {
            type: QueryTypes.SELECT,
        })

        const total = Number(countRows[0].total)

        return {
            rows, total,
        }
    }

    async update(id, {
        name, registered_on, credit_limit, priority,
    }) {
        const rows = await sequelize.query(`
            UPDATE customers
            SET
                name = :name,
                registered_on = :registered_on,
                credit_limit = :credit_limit,
                priority = :priority
            WHERE id = :id
            RETURNING
                id,
                name,
                registered_on,
                credit_limit,
                priority
            `, {
            replacements: {
                id, name, registered_on, credit_limit, priority,
            }, type: QueryTypes.SELECT,
        })

        return rows[0] || null
    }

    async delete(id) {
        const rows = await sequelize.query(`
            DELETE FROM customers
            WHERE id = :id
            RETURNING id
            `, {
            replacements: {
                id,
            }, type: QueryTypes.SELECT,
        })

        return rows.length > 0
    }
}

module.exports = new CustomersModel()