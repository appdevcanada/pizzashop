const config = require('config')
const logger = require('./logger')

module.exports = () => {
  const mongoose = require('mongoose')
  const dbConfig = config.get('db')

  let credentials = ''
  if (process.env.NODE_ENV === 'production') {
    credentials = `${dbConfig.user}:${dbConfig.password}@`
  }

  const connectionString = `mongodb://${credentials}${dbConfig.host}:${dbConfig.port}/${dbConfig.name}?authSource=admin`

  mongoose
    .connect(connectionString, {
      useNewUrlParser: true
    })
    .then(() => {
      logger.log('info', `Connected to MongoDB at ${dbConfig.host}...`)
    })
    .catch(err => {
      logger.log('error', `Error connecting to MongoDB at ${dbConfig.host}...`, err)
      process.exit(1)
    })
}