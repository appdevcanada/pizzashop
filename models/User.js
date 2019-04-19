const mongoose = require('mongoose')


const schema = mongoose.Schema({
    
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    isStaff: Boolean,
    

  })


const Model = mongoose.model('user', schema)



module.exports = Mode
