const mongoose = require('mongoose')


const schema = mongoose.Schema({
    
    customer:ObjectId, ref: 'User',//needs to be changed 
    type: ENUM ['pickup', 'delivery'],//needs to be changed
    status: ENUM ['draft', 'ordered', 'paid', 'delivered'], //needs to be changed
    pizzas:[ ObjectId, ref: 'Pizza' ], //needs to be changed
    address: String,
    price: Number,
    deliveryCharge: Number,
    tax: Number,
    total: Number,
    createdAt:Date,//use Date.now()???
    updatedAt:Date//use Date.now() ???

    

  })


const Model = mongoose.model('order', schema)



module.exports = Mode