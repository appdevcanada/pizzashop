const router = require('express').Router()
const Student = require('../models/Student')
const sanitizeBody = require('../middleware/sanitizeBody')
const Authorized = require('./auth/index')
var isAdmin = false
var actualUser = ''

router.get('/', async (req, res) => {
  try {
    const admin = await Authorized.retData()
    isAdmin = admin.isAdmin
    actualUser = admin.nowUser
  } catch (err) {
    console.log(err)
  }
  if (actualUser != '') {
    const students = await Student.find()
    res.send({ data: students })
  } else {
    res.status(500).send({
      errors: [
        {
          status: 'Server error',
          code: '500',
          title: 'Unauthorized access to this table and request type.'
        }
      ]
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const admin = await Authorized.retData()
    isAdmin = admin.isAdmin
    actualUser = admin.nowUser
  } catch (err) {
    console.log(err)
  }
  if (actualUser != '') {
    try {
      const student = await Student.findById(req.params.id)
      if (!student) throw new Error('Resource not found')
      res.send({ data: student })
    } catch (err) {
      sendResourceNotFound(req, res)
    }
  } else {
    res.status(500).send({
      errors: [
        {
          status: 'Server error',
          code: '500',
          title: 'Unauthorized access to this table and request type.'
        }
      ]
    })
  }
})

router.post('/', sanitizeBody, async (req, res) => {
  try {
    const admin = await Authorized.retData()
    isAdmin = admin.isAdmin
    actualUser = admin.nowUser
  } catch (err) {
    console.log(err)
  }
  if (isAdmin) {
    let newStudent = new Student(req.sanitizedBody)
    try {
      await newStudent.save()
      res.status(201).send({ data: newStudent })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        errors: [
          {
            status: 'Server error',
            code: '500',
            title: 'Problem saving student document to the database.'
          }
        ]
      })
    }
  } else {
    res.status(500).send({
      errors: [
        {
          status: 'Server error',
          code: '500',
          title: 'Unauthorized access to this table.'
        }
      ]
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const admin = await Authorized.retData()
    isAdmin = admin.isAdmin
  } catch (err) {
    console.log(err)
  }
  if (isAdmin) {
    try {
      const student = await Student.findByIdAndRemove(req.params.id)
      if (!student) throw new Error('Resource not found')
      res.send({ data: student })
    } catch (err) {
      sendResourceNotFound(req, res)
    }
  } else {
    res.status(500).send({
      errors: [
        {
          status: 'Server error',
          code: '500',
          title: 'Unauthorized access to this table and request type.'
        }
      ]
    })
  }
})

function sendResourceNotFound(req, res) {
  res.status(404).send({
    errors: [
      {
        status: 'Not Found',
        code: '404',
        title: 'Resource does not exist',
        description: `We could not find a student with id: ${req.params.id}`
      }
    ]
  })
}

const update = (overwrite = false) => async (req, res) => {
  try {
    const admin = await Authorized.retData()
    isAdmin = admin.isAdmin
  } catch (err) {
    console.log(err)
  }
  if (isAdmin) {
    try {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        req.sanitizedBody,
        {
          new: true,
          overwrite,
          runValidators: true
        }
      )
      if (!student) throw new Error('Resource not found')
      res.send({ data: student })
    } catch (err) {
      sendResourceNotFound(req, res)
    }
  } else {
    res.status(500).send({
      errors: [
        {
          status: 'Server error',
          code: '500',
          title: 'Unauthorized access to this table and request type.'
        }
      ]
    })
  }
}

router.put('/:id', sanitizeBody, update((overwrite = true)))

router.patch('/:id', sanitizeBody, update((overwrite = false)))

module.exports = router
