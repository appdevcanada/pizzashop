const mongoose = require('mongoose')


const schema = mongoose.Schema({
    name: String,
    price: Number,
    size: ENUM ['small', 'medium', 'large', 'extra large'],
    isGlutenFree: Boolean,
    imageUrl: String,
    
    ingredients: [ ObjectId, ref: 'Ingredient' ], //This and extra toppings need to be changed, need to reference the object by ID Ingredient
    extraToppings: [ ObjectId, ref: 'Ingredient' ]
    
  })


const Model = mongoose.model('Pizza', schema)



module.exports = Model
