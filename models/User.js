const mongoose = require('mongoose')


const schema = new mongoose.Schema({

    firstName: { type: String, trim: true, maxlength: 64, required: true },
    lastName: { type: String, trim: true, maxlength: 64 },
    email: { type: String, trim: true, maxlength: 512, required: true },
    password: { type: String, trim: true, maxlength: 70, required: true },
    isStaff: { type: Boolean, required: false, default: false }

})


const Model = mongoose.model('User', schema)



module.exports = Model
