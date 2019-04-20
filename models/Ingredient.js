const mongoose = require('mongoose')


const schema = mongoose.Schema({
    
    name: String,
    price: Number,
    quantity: Number,
    isGlutenFree: Boolean,
    imageUrl: String,
    catagories: [ENUM ['meat', 'spicy', 'vegitarian', 'vegan', 'halal', 'kosher', 'cheeze', 'seasonings']]
    

  })


const Model = mongoose.model('ingredient', schema)



module.exports = Mode

