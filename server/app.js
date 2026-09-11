const express = require('express')
const cors = require('cors')
const routes = require('./src/routes')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
})


const app = express()


app.use(cors({origin: process.env.CLIENT_URL}))
app.use(express.json({ limit: '100kb'}))
app.use('/api', apiLimiter)
app.use('/api', routes)
app.use(helmet())
app.disable('x-powered-by')


module.exports = app