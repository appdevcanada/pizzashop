const mongoose = require('mongoose')


const schema = mongoose.Schema({

    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, trim: true, lowercase: true, enum: ['pickup', 'delivery'], default: 'pickup' },
    status: { type: String, trim: true, lowercase: true, enum: ['draft', 'ordered', 'paid', 'delivered'], default: 'draft' },
    pizzas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' }],
    address: { type: String, trim: true, lowercase: true, required: true },
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

schema.pre("save", function (next) {
    if (!this.updatedAt) {
        this.updatedAt = new Date();
    }
    next();
});

const Model = mongoose.model('Order', schema)



module.exports = Model