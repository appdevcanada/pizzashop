const router = require('express').Router()
const sanitizeBody = require('../middleware/sanitizeBody')
const Ingredient = require('../models/Ingredient')
const authorize = require('../middleware/auth')
const ResourceNotFoundError = require('../exceptions/ResourceNotFound')
const staff = require('../middleware/staff')


router.get('/', async (req, res) => {
  const ingredient = await Ingredient.find()
  res.send({
    data: ingredient
  })
})

router.post('/', sanitizeBody, authorize, staff, async (req, res, next) => {
  try {
    let newIngredient = new Ingredient(req.sanitizedBody)
    await newIngredient.save()
    res.status(201).send({
      data: newIngredient
    })

  } catch (err) {
    next(err)
  }

})

router.get('/:id', async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id)
    if (!ingredient) throw new ResourceNotFoundError(
      `We could not find an ingredient with id: ${req.params.id}`
    )
    res.send({
      data: ingredient
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
    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id, {
        _id: req.params.id,
        ...otherAttributes
      }, {
        new: true,
        runValidators: true
      }
    )
    if (!ingredient) throw new Error(
      `We could not find an ingredient with id: ${req.params.id}`
    )
    res.send({
      data: ingredient
    })
  } catch (err) {
    next(req, res)
  }
})

router.put('/:id', sanitizeBody, authorize, staff, async (req, res, next) => {

  try {
    const {
      _id,
      ...otherAttributes
    } = req.sanitizedBody
    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id, {
        _id: req.params.id,
        ...otherAttributes
      }, {
        new: true,
        overwrite: true,
        runValidators: true
      }
    )
    if (!ingredient) throw new ResourceNotFoundError(
      `We could not find an ingredient with id: ${req.params.id}`
    )
    res.send({
      data: ingredient
    })
  } catch (err) {
    next(err)
  }
})
router.delete('/:id', authorize, staff, async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findByIdAndRemove(req.params.id)
    if (!ingredient) throw new ResourceNotFoundError(
      `We could not find an ingredient with id: ${req.params.id}`
    )
    res.send({
      data: ingredient
    })
  } catch (err) {
    next(err)
  }
})





module.exports = router

