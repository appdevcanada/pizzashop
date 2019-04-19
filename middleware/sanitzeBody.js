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
        attributes[key] = attributes[key].map(element => {
          return typeof element === 'string'
            ? sanitize(element) 
            : stripTags(element) 
        })
      } else if (attributes[key] instanceof Object) {
        attributes[key] = stripTags(attributes[key])
      } else {
        attributes[key] = sanitize(attributes[key])
      }
    }
    return attributes
  }
  

  module.exports = (req, res, next) => {
    const { id, _id, ...attributes } = req.body
    const sanitizedBody = stripTags(attributes)
    req.sanitizedBody = sanitizedBody
    next()
  }