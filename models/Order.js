const mongoose = require('mongoose')


const schema = mongoose.Schema({
    
    deliveryCharge: {
        type: Number,
        default: function() {
            return this.type === 'devlivery' ? 500:0
            
        },
        
        set: value: => Math.floor(value)
        
    },

    customer: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    type: {type: String, trim:true,lowercase: true,default:'pickup', enum: ['pickup','delivery']},
                               
    status: {type: String, trim:true,lowercase:true,default:'draft', enum: ['draft','ordered','paid','delivered']},
    pizzas: [{type: mongoose.Schema.Types.ObjectId,ref:'Pizza'}],
    
    address: {type: String, trim:true,lowercase: true,required:true},
    price: {type:Number, default: 0,},
    deliveryCharge: {type: Number,default: 0},
    tax: {type: Number, default: 0},
    total: {type: Number,default: 0},
    //createdAt: 
    //updatedAt: 


})


const Model = mongoose.model('Order', schema)



module.exports = Model