require('dotenv').config()

const app = require('./app.js')
const sequelize = require('./src/db/db.js')
require('./src/models/models.js')

const PORT = process.env.PORT || 5000

const start = async () => {
    try {
        await sequelize.authenticate()

        console.log('Соединение с базой данных установлено')

        const server = app.listen(PORT, () => {
            console.log(`Сервер работает на порту: ${PORT}`)
        })

        const shutdown = async (signal) => {
            console.log(`${signal}: Завершение работы сервера`)

            server.close(async () => {
                try {
                    await sequelize.close()
                    console.log('Соединение с БД закрыто')
                    process.exit(0)
                } catch (error) {
                    console.error('Ошибка при закрытии БД', error)
                    process.exit(1)
                }
            })
        }

        process.on('SIGINT', () => shutdown('SIGINT'))
        process.on('SIGTERM', () => shutdown('SIGTERM'))
    } catch (error) {
        console.error('Не удалось запустить сервер:', error)
        process.exit(1)
    }
}

start()