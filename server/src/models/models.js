const sequelize = require('../db/db.js')
const {DataTypes} = require('sequelize')

const Customers = sequelize.define('customers', {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING(30), allowNull: false,},
        registered_on: {type: DataTypes.DATEONLY, allowNull: false,},
        credit_limit: {type: DataTypes.DECIMAL(10, 2), allowNull: false,},

    },
    {
        tableName: 'customers',
        timestamps: false
    }
)

const Orders = sequelize.define('orders', {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        customer_id: {type: DataTypes.INTEGER, allowNull: false, onUpdate: 'CASCADE', onDelete: 'RESTRICT',},
        title: {type: DataTypes.STRING(200), allowNull: true},
        order_date: {type: DataTypes.DATEONLY, allowNull: false,},
        amount: {type: DataTypes.DECIMAL(10, 2), allowNull: false,},
        quantity: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
    },
    {
        tableName: 'orders',
        timestamps: false
    })


Orders.belongsTo(Customers, {foreignKey: 'customer_id', as: 'customer',})
Customers.hasMany(Orders, {foreignKey: 'customer_id', as: 'orders',})

module.exports = {
    Orders,
    Customers,
}