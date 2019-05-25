const debug = require('debug')('final-mora0199-call0099:db')
const xss = require('xss')
//const logger = require('../startup/logger')

const sanitize = sourceString => {
  return xss(sourceString, {
    whiteList: [],
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script']
  })
}

const stripTags = payload => {
  let attributes = { ...payload }
  for (let key in attributes) {
    if (attributes[key] instanceof Array) {
      debug('Recurse array', attributes[key])
      attributes[key] = attributes[key].map(element => {
        return typeof element === 'string'
          ? sanitize(element)
          : stripTags(element)
      })
    } else if (attributes[key] instanceof Object) {
      debug('Recurse object', attributes[key])
      attributes[key] = stripTags(attributes[key])
    } else {
      debug('Recurse general', key, attributes[key])
      attributes[key] = sanitize(attributes[key])
    }
  }
  return attributes
}

module.exports = (req, res, next) => {
  debug({ body: req.body })
  const { id, _id, ...attributes } = req.body
  debug({ attributes })
  const sanitizedBody = stripTags(attributes)
  debug({ sanitizedBody })
  req.sanitizedBody = sanitizedBody
  next()
}
