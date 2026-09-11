const {QueryTypes} = require('sequelize')
const sequelize = require('../db/db')
const {Orders} = require('./models')

class OrdersModel {

    async create({
                     customer_id,
                     title,
                     order_date,
                     amount,
                     quantity,
                 }) {
        const rows = await sequelize.query(
            `
            INSERT INTO orders (
                customer_id,
                title,
                order_date,
                amount,
                quantity
            )
            VALUES (
                :customer_id,
                :title,
                :order_date,
                :amount,
                :quantity
            )
            RETURNING
                id,
                customer_id,
                title,
                order_date,
                amount,
                quantity
            `,
            {
                replacements: {
                    customer_id,
                    title,
                    order_date,
                    amount,
                    quantity,
                },
                type: QueryTypes.SELECT,
            }
        )

        return rows[0]
    }

    async getAll({limit, offset}) {
        const {rows,count} = await Orders.findAndCountAll({
            order: [['id', 'ASC']],
            limit,
            offset,
        })

        return {
            rows,
            total: count,
        }
    }

    async getById(id) {
        const rows = await sequelize.query(
            `
            SELECT
                id,
                customer_id,
                title,
                order_date,
                amount,
                quantity
            FROM orders
            WHERE id = :id
            `,
            {
                replacements: {
                    id,
                },
                type: QueryTypes.SELECT,
            }
        )

        return rows[0] || null
    }

    async update(
        id,
        {
            customer_id,
            title,
            order_date,
            amount,
            quantity,
        }
    ) {
        const order = await Orders.findByPk(id)

        if (!order) {
            return null
        }

        order.customer_id = customer_id
        order.title = title
        order.order_date = order_date
        order.amount = amount
        order.quantity = quantity

        await order.save()

        return order
    }

    async delete(id) {
        const order = await Orders.findByPk(id)

        if (!order) {
            return false
        }

        await order.destroy()

        return true
    }
}

module.exports = new OrdersModel()