const mongoose = require('mongoose')
const Pizza = require('./Pizza')


const schema = mongoose.Schema({

    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, trim: true, lowercase: true, enum: ['pickup', 'delivery'], default: 'pickup' },
    status: { type: String, trim: true, lowercase: true, enum: ['draft', 'ordered', 'paid', 'delivered'], default: 'draft' },
    pizzas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' }],
    address: {
        type: String, trim: true, lowercase: true, required: function () {
            this.type == 'delivery' ? true : false
        }
    },
    price: { type: Number, default: 0 },
    deliveryCharge: {
        type: Number,
        default: function () {
            return this.type === 'delivery' ? 500 : 0
        },
        set: value => Math.floor(value)
    },

    tax: {
        type: Number, default: 0, set: value => Math.floor(value)
    },
    total: {
        type: Number, default: 0, set: value => Math.floor(value)
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }


})

schema.pre('save', async function () {
    await this.populate('Pizza').execPopulate();

    this.price = this.Pizza.reduce((acc, element) => acc += element.price, 0)

    if (this.type == 'delivery') {
        this.tax = (this.price + this.deliveryCharge) * 0.13;
        this.total = this.price + this.tax + this.deliveryCharge;
    } else {
        this.tax = (this.price) * 0.13;
        this.total = this.price + this.tax;
    }

})

const Model = mongoose.model('Order', schema)



module.exports = Model