const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const config = require('config')
const dbConfig = config.get('jwt')
const uniqueValidator = require('mongoose-unique-validator')
const validator = require('validator');
const saltRounds = dbConfig.saltRounds
const jwtPrivateKey = process.env.APP_JWTKEY
//const logger = require('../startup/logger')

const schema = new mongoose.Schema({
    firstName: { type: String, trim: true, maxlength: 64, required: true },
    lastName: { type: String, trim: true, maxlength: 64 },
    email: {
        type: String, trim: true, maxlength: 512, required: true, set: value => value.toLowerCase(),
        validator: {
            validator: value => validator.isEmail(value),
            message: props => `${props.value} is not a valid email address.`
        }
    },
    password: { type: String, trim: true, maxlength: 70, required: true },
    isStaff: { type: Boolean, required: false, default: false }
})

schema.methods.toJSON = function () {
    const obj = this.toObject()
    delete obj.password
    delete obj.__v
    return obj
}

schema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, jwtPrivateKey)
}

schema.statics.authenticate = async function (email, password) {
    const user = await this.findOne({ email: email })
    const hashedPassword = user
        ? user.password
        : `$2b$${saltRounds}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
    const passwordDidMatch = await bcrypt.compare(password, hashedPassword)

    return passwordDidMatch ? user : null
}

schema.pre('save', async function (next) {
    // Only encrypt if the password property is being changed.
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, saltRounds)
    next()
})

schema.post('findByIdAndUpdate', function (doc) {
    doc.save()
    next()
})

schema.plugin(uniqueValidator, {
    message: props =>
        props.path === 'email' ?
            `The email address '${props.value}' is already registerd.` : `The ${props.path} must be unique. '${props.value}' is already in use.`
})

const Model = mongoose.model('User', schema)

module.exports = Model
