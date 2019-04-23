const router = require('express').Router()
const Ingredient = require('../models/Ingredient')
const sanitizeBody = require('../middleware/sanitizeBody')
const Authorized = require('./auth/index')
const Cors = require('cors')
const dbConfig = config.get('db')
var isStaff = false
var actualUser = ''

router.get('/', Cors(dbConfig.cors), async (req, res) => {
  try {
    const staff = await Authorized.retData()
    isStaff = staff.isStaff
    actualUser = staff.nowUser
  } catch (err) {
    console.log(err)
  }
  if (actualUser != '') {
    const ingredients = await Ingredient.find().populate('orders')
    res.send({ data: ing })
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

router.get('/:id', Cors(dbConfig.cors), async (req, res) => {
  try {
    const staff = await Authorized.retData()
    isStaff = staff.isStaff
    actualUser = staff.nowUser
  } catch (err) {
    console.log(err)
  }
  if (actualUser != '') {
    try {
      const ingredient = await Ingredient.findById(req.params.id).populate('orders')
      if (!ingredient) throw new Error('Resource not found')
      res.send({ data: ingredient })
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
    const staff = await Authorized.retData()
    isStaff = staff.isStaff
    actualUser = staff.nowUser
  } catch (err) {
    console.log(err)
  }
  if (isStaff) {
    let newIngredient = new Ingredient(req.sanitizedBody)
    try {
      await newIngredient.save()
      res.status(201).send({ data: newIngredient })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        errors: [
          {
            status: 'Server error',
            code: '500',
            title: 'Problem saving ingredient document to the database.'
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

router.delete('/:id', Cors(dbConfig.cors), async (req, res) => {
  try {
    const staff = await Authorized.retData()
    isStaff = staff.isStaff
  } catch (err) {
    console.log(err)
  }
  if (isStaff) {
    try {
      const ingredient = await ingredient.findByIdAndRemove(req.params.id)
      if (!ingredient) throw new Error('Resource not found')
      res.send({ data: ingredient })
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
        description: `We could not find a Ingredient with id: ${req.params.id}`
      }
    ]
  })
}

const update = (overwrite = false) => async (req, res) => {
  try {
    const staff = await Authorized.retData()
    isStaff = staff.isStaff
  } catch (err) {
    console.log(err)
  }
  if (isStaff) {
    try {
      const ingredient = await ingredient.findByIdAndUpdate(
        req.params.id,
        req.sanitizedBody,
        {
          new: true,
          overwrite,
          runValidators: true
        }
      )
      if (!ingredient) throw new Error('Resource not found')
      res.send({ data: ingredient })
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
