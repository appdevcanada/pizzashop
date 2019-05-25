const router = require('express').Router()
const Pizza = require('../models/Pizza')
const sanitizeBody = require('../middleware/sanitizeBody')
const authorize = require('../middleware/auth')
const ResourceNotFoundError = require('../exceptions/ResourceNotFound')
const staff = require('../middleware/staff')


router.get('/', async (req, res) => {
  const pizza = await Pizza.find()
  res.send({
    data: pizza
  })
})

router.post('/', sanitizeBody, authorize, staff, async (req, res, next) => {

  try {
    let newPizza = new Pizza(req.sanitizedBody)
    await newPizza.save()

    res.status(201).send({
      data: newPizza
    })
  } catch (err) {
    next(req, res)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id)
    if (!pizza) throw new ResourceNotFoundError(
      `We could not find a pizza with id: ${req.params.id}`
    )
    res.send({
      data: pizza
    })
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', sanitizeBody, authorize, staff, async (req, res, next) => {
  try {
    const {
      _id,
      ...otherAttributes
    } = req.sanitizedBody

    const pizza = await Pizza.findByIdAndUpdate(
      req.params.id, {
        _id: req.params.id,
        ...otherAttributes
      }, {
        new: true,
        runValidators: true
      }
    )
    if (!pizza) throw new ResourceNotFoundError(
      `We could not find a pizza with id: ${req.params.id}`
    )
    res.send({
      data: pizza
    })
  } catch (err) {
    next(err)
  }
})

router.put('/:id', sanitizeBody, authorize, staff, async (req, res, next) => {
  try {
    const {
      _id,
      ...otherAttributes
    } = req.sanitizedBody
    const pizza = await Pizza.findByIdAndUpdate(
      req.params.id, {
        _id: req.params.id,
        ...otherAttributes
      }, {
        new: true,
        overwrite: true,
        runValidators: true
      }
    )
    if (!pizza) throw new ResourceNotFoundError(
      `We could not find a pizza with id: ${req.params.id}`
    )
    res.send({
      data: pizza
    })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', authorize, staff, async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndRemove(req.params.id)
    if (!pizza) throw new ResourceNotFoundError(
      `We could not find a pizza with id: ${req.params.id}`
    )
    res.send({
      data: pizza
    })
  } catch (err) {
    next(err)
  }
})





module.exports = router