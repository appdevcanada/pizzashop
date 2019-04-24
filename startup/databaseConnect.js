const config = require('config')
const logger = require('./logger')

module.exports = () => {
  const mongoose = require('mongoose')
  const dbConfig = config.get('db')

  let credentials = ''
  if (process.env.NODE_ENV === 'production') {
    credentials = `${dbConfig.username}:${dbConfig.password}@`
  }

  const connectionString = `mongodb://${credentials}${dbConfig.host}:${dbConfig.port}/${dbConfig.name}?authSource=admin`
  mongoose
    .connect(connectionString, {
      useNewUrlParser: true
    })
    .then(() => {
      logger.log('info', `Connected to MongoDB ...`)
    })
    .catch(err => {
      logger.log('error', `Error connecting to MongoDB ...`, err)
      process.exit(1)
    })
}