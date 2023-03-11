const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema

const userSchema = new Schema({
    number : {
        type : String ,
        require : true 
    }
} , {timestamps : true} )



 userSchema.methods.generateJWT = function () {
     const token = jwt.sign({
         _id: this._id ,
         number: this.number 
     } , process.env.JWT_SECRET , {expiresIn: "7d"} )
 }


 module.exports = mongoose.model('User' , userSchema)