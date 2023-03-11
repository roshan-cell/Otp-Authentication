const mongoose = require('mongoose')

const Schema = mongoose.Schema

const otpSchema = new Schema({
    number : {
        type : String,
        require : true
    },
    otp: {
        type: String,
        require: true
    },
    createdAt: {type: Date , default: Date.now , index: {expires: 300} }

} , {timestamps: true})


module.exports = mongoose.model('Otp' , otpSchema)