const router = require('express').Router()
const sanitizeBody = require('../middleware/sanitizeBody')
const Order = require('../models/Order')
const authorize = require('../middleware/auth')
const ResourceNotFoundError = require('../exceptions/ResourceNotFound')

router.get('/', authorize, async (req, res) => {
    const order = await Order.find()
    res.send({
        data: order
    })
})

router.post('/', sanitizeBody, authorize, async (req, res, next) => {

    try {
        let newOrder = new Order(req.sanitizedBody)
        await newOrder.save()

        res.status(201).send({
            data: newOrder
        })
    } catch (err) {
        next(req, res)
    }
})

router.get('/:id', authorize, async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order) throw new ResourceNotFoundError(
            `We could not find an order with id: ${req.params.id}`
        )
        res.send({
            data: order
        })
    } catch (err) {
        next(err)
    }
})

router.patch('/:id', sanitizeBody, authorize, async (req, res, next) => {
    try {
        const {
            _id,
            ...otherAttributes
        } = req.sanitizedBody
        const order = await Order.findByIdAndUpdate(
            req.params.id, {
                _id: req.params.id,
                ...otherAttributes
            }, {
                new: true,
                runValidators: true
            }
        )
        if (!order) throw new Error(
            `We could not find an order with id: ${req.params.id}`
        )
        res.send({
            data: order
        })
    } catch (err) {
        next(req, res)
    }
})

router.put('/:id', sanitizeBody, authorize, async (req, res, next) => {

    try {
        const {
            _id,
            ...otherAttributes
        } = req.sanitizedBody
        const order = await Order.findByIdAndUpdate(
            req.params.id, {
                _id: req.params.id,
                ...otherAttributes
            }, {
                new: true,
                overwrite: true,
                runValidators: true
            }
        )
        if (!order) throw new ResourceNotFoundError(
            `We could not find an order with id: ${req.params.id}`
        )
        res.send({
            data: order
        })
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', authorize, async (req, res, next) => {
    try {
        const order = await Order.findByIdAndRemove(req.params.id)
        if (!order) throw new ResourceNotFoundError(
            `We could not find an order with id: ${req.params.id}`
        )
        res.send({
            data: order
        })
    } catch (err) {
        next(err)
    }
})





module.exports = router