const mongoose = require('mongoose')


const schema = mongoose.Schema({

    name: String,
    price: Number,
    quantity: Number,
    isGlutenFree: Boolean,
    imageUrl: String,
    categories: [ENUM['meat', 'spicy', 'vegetarian', 'vegan', 'halal', 'kosher', 'cheeze', 'seasonings']]


})


const Model = mongoose.model('Ingredient', schema)



module.exports = Model

