'use strict'

require('./startup/databaseConnect')('final-mora0199-call0099')
const debug = require('debug')('final-mora0199-call0099')
const sanitizeMongo = require('express-mongo-sanitize')

const cors = require('cors')
const helmet = require('helmet')
const express = require('express')
const app = express()
const config = require('config')
const corsConfig = config.get('cors')

app.use(cors(corsConfig))
app.use(sanitizeMongo())
app.use(helmet())
app.use(express.json())
app.use(require('express-mongo-sanitize')())

app.use('/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/auth'))

app.use('/api/ingredients', require('./routes/ingredients'))
app.use('/api/pizzas', require("./routes/pizzas"))
app.use('/api/orders', require("./routes/orders"))


app.use(require('./middleware/logError'))
app.use(require('./middleware/errorHandler'))


const port = process.env.PORT || 3030
app.listen(port, () => debug(`Express is listening on port ${port}...`))
