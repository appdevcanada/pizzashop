const mongoose = require('mongoose')


const schema = mongoose.Schema({

    
    name: { type: String, trim: true, minlength: 4, maxlength: 64, required: true},                        
    price: { type: Number, trim: true, minvalue: 1000, maxvalue: 10000},
    size: {type:String, trim: true, lowercase:true, enum: ['small','medium','large','extra large'], default: 'small'},
    isGlutenFree: {type: Boolean, Default: false},
    imageUrl: {type: String, trim: true, maxlength: 64},
    ingredients: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}],
    extraToppings: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}]




})


const Model = mongoose.model('Pizza', schema)



module.exports = Model
