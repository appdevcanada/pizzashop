const mongoose = require('mongoose')


const schema = mongoose.Schema({

    name: {type: String, trim: true, maxlength: 64, required:true},
    price: {type: Number, maxvalue: 10000, default: 100},
    quantity: {type: Number, maxvalue:1000, default: 10},
    isGlutenFree: {type: Boolean, default:false},
    imageUrl: {type: String, trim:true, maxlength:1024},
    categories: {type: String, trim:true, lowercase: true, enum: ['meat','spicy','vegetarian','vegan','halal','kosher', 'cheese', 'seasonings']}
    


})


const Model = mongoose.model('Ingredient', schema)



module.exports = Model

