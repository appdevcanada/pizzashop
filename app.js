'use strict'

require('./startup/databaseConnect')('final-mora0199-call0099')
const debug = require('debug')('final-mora0199-call0099')
const sanitizeMongo = require('express-mongo-sanitize')

const cors = require('cors')
const helmet = require('helmet')
const express = require('express')
const app = express()

app.use(sanitizeMongo())
//app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(require('express-mongo-sanitize')())

app.use('/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/auth'))

// app.use('/courses', require('./routes/courses'))
// app.use('/students', require('./routes/students'))

const port = process.env.PORT || 3030
app.listen(port, () => debug(`Express is listening on port ${port}...`))
