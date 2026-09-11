const {QueryTypes} = require('sequelize')
const {Customers} = require('./models')
const sequelize = require('../db/db')

class CustomersModel {

    async create({name, registered_on, credit_limit}) {
        return Customers.create({
            name,
            registered_on,
            credit_limit,
        })
    }


    async getbyId(id) {
        return Customers.findByPk(id)
    }

    async gatAll({limit, offset}) {
        const rows = await sequelize.query(
            'SELECT id, name, registered_on, credit_limit, ' +
            'COUNT(*) OVER() AS total ' +
            'FROM customers ' +
            'ORDER BY id ' +
            'LIMIT :limit OFFSET :offset',
            {
                replacements: {
                    limit,
                    offset,
                },
                type: QueryTypes.SELECT
            }
        )

        const total = rows.length > 0
            ? Number(rows[0].total)
            : 0

        const customers = rows.map(({total, ...customers}) => customers)

        return {
            rows: customers,
            total,
        }
    }

    async update(id, {name, registered_on, credit_limit}) {
        const rows = await sequelize.query(
            'UPDATE customers' +
            'SET name=:name, registered_on = :registered_on, credit_limit = :credit_limit, ' +
            'WHERE id = :id RETURNING id, name,registered_on, credit_limit, ',

            {
                replacements: {
                    id,
                    name,
                    registered_on,
                    credit_limit,
                },
                type: QueryTypes.SELECT,
            }
        )

        return rows[0] || null
    }

    async delete(id) {
        const rows = await sequelize.query(
            'DELETE ' +
            'FROM customers' +
            ' WHERE id=:id RETURNING id',
            {
                replacements: {
                    id,
                },
                type: QueryTypes.SELECT,
            }
        )

        return rows.length > 0
    }
}

module.exports = new CustomersModel()