const express = require('express')
const router = express.Router()
const sanitizeBody = require('../../middleware/sanitizeBody')
const authorize = require('../../middleware/auth')
const User = require('../../models/User')
const Auth = require('../../models/Auth_attempts')
const cors = require('cors')
const config = require('config')
const corsConfig = config.get('cors')
// const logger = require('../../startup/logger')

var nowUser = ""
var isStaff = false
var ipAddress = ""

router.options("*", cors(corsConfig))

// Register a new user
router.post('/users', sanitizeBody, async (req, res) => {
  try {
    let newUser = new User(req.sanitizedBody)
    const itExists = !!(await User.countDocuments({ email: newUser.email }))
    if (itExists) {
      return res.status(400).send({
        errors: [
          {
            status: 'Bad Request',
            code: '400',
            title: 'Validation Error',
            detail: `Email address '${newUser.email}' is already registered.`,
            source: { pointer: '/data/attributes/email' }
          }
        ]
      })
    }
    await newUser.save()
    res.status(201).send({ data: newUser })
  } catch (err) {
    res.status(500).send({
      errors: [
        {
          status: 'Internal Server Error',
          code: '500',
          title: 'Problem saving document to the database.'
        }
      ]
    })
  }
})

router.get('/users/me', authorize, async (req, res) => {
  const user = await User.findById(req.user._id)
  nowUser = user._id
  isStaff = user.isStaff
  ipAddress = req.ip
  saveAttempt()
  res.send({ data: user })
})

router.patch('/users/me', authorize, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    user.password = req.body.password
    await user.save()
    res.send({ data: user })
  } catch (err) {
    next(err)
  }
})

router.post('/tokens', sanitizeBody, async (req, res) => {
  const { email, password } = req.sanitizedBody
  const user = await User.authenticate(email, password)

  if (!user) {
    return res.status(401).send({
      errors: [
        {
          status: 'Unauthorized',
          code: '401',
          title: 'Incorrect username or password.',
          detail: 'We could not get a token for this login'
        }
      ]
    })
  }
  res.status(201).send({ data: { token: user.generateAuthToken() } })
})

router.delete('/:_id', async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params._id)
    if (!user) throw new Error('Resource not found')
    res.send({ data: user })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
})

const update = (overwrite = false) => async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params._id,
      req.sanitizedBody,
      {
        new: true,
        overwrite,
        runValidators: true
      }
    )
    if (!user) throw new Error('Resource not found')
    res.send({ data: user })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
}

async function retData() {
  const ret = { "nowUser": nowUser, "isStaff": isStaff }
  return ret
}

function sendResourceNotFound(req, res) {
  res.status(404).send({
    errors: [
      {
        status: 'Not Found',
        code: '404',
        title: 'Resource does not exist',
        detail: `We could not find an user with ID: ${req.params._id}`
      }
    ]
  })
}

router.put('/:_id', sanitizeBody, update((overwrite = true)))

router.patch('/:_id', sanitizeBody, update((overwrite = false)))

async function saveAttempt() {
  let dateNow = convertUTCDateToLocalDate(new Date())
  let newAuth = new Auth({
    "username": nowUser,
    "ipAddress": ipAddress,
    createdAt: dateNow
  })
  try {
    await newAuth.save()
  } catch (err) {
    console.log(err)
    res.status(500).send({
      errors: [
        {
          status: 'Server error',
          code: '500',
          title: 'Problem saving auth_attempt document to the database.'
        }
      ]
    })
  }
}

// In case we need to get all attempts
// router.get('/', async (req, res) => {
//   const newAuth = await Auth.find()
//   res.status(201).send({ data: newAuth })
// })

function convertUTCDateToLocalDate(date) {
  let newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  let offset = date.getTimezoneOffset() / 60;
  let hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}

module.exports = router
module.exports.retData = retData
