const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const routes = require('./src/routes')
const errorHandlingMiddleware = require('./src/middleware/ErrorHandlingMiddleware')
const notFoundMiddleware = require('./src/middleware/ErrorHandlingMiddleware')

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
})


const app = express()

app.disable('x-powered-by')

app.use(helmet())


app.use(cors({origin: process.env.CLIENT_URL}))
app.use(express.json({ limit: '100kb'}))
app.use('/api', apiLimiter)
app.use('/api', routes)
app.use(notFoundMiddleware)
app.use(errorHandlingMiddleware)



module.exports = app