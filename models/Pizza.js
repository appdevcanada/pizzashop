const mongoose = require('mongoose')


const schema = mongoose.Schema({

    name: { type: String, trim: true, minlength: 4, maxlength: 64, required: true },
    price: { type: Number, min: 1000, max: 10000 },
    size: { type: String, trim: true, lowercase: true, enum: ['small', 'medium', 'large', 'extra large'], default: 'small' },
    isGlutenFree: { type: Boolean, Default: false },
    imageUrl: { type: String, trim: true, maxlength: 64 },
    ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }],
    extraToppings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }]

})

schema.pre('save', async function () {
    let total = 0;
    await this.populate('ingredients extraToppings').execPopulate();
    [...this.ingredients, ...this.extraToppings].forEach(ingredient => {

        total += ingredient.price

    })
    if (total > this.price) {
        this.price = total;
    }
})

const Model = mongoose.model('Pizza', schema)



module.exports = Model
