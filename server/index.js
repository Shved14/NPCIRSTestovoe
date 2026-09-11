require('dotenv').config()

const app = require('./app.js')
const sequelize = require('./src/db/db.js')
require('./src/models/models.js')


const PORT = process.env.PORT || 5000
``

const start = async () => {
    try {
        await sequelize.authenticate()

        console.log('Соединение с базой данных установлено')

        app.listen(PORT, () => {
            console.log(`Сервер работает на порту: ${PORT}`)
        })
    } catch (error) {
        console.error('Неудалось запустить сервер:', error)
        process.exit(1)
    }
}

start()