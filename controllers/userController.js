const bcrypt = require("bcrypt") 
const _ = require("lodash")
const axios = require("axios")
const otpGenerator = require('otp-generator')

const  User  = require('../models/userModel')
const  Otp  = require('../models/otpModel')

const signUp  = async(req ,res) => {
      const user  = await User.findOne({
          number: req.body.number
      });

      if (user) return res.status(400).send("User already exist !!");
      const OTP = otpGenerator.generate(6 , {
          digits: true , specialChars: false , lowerCaseAlphabets: false , upperCaseAlphabets: false
      });
      const number = req.body.number 
      console.log(OTP) ; 

      const otp = new Otp({number: number , otp: OTP})
      const salt = await bcrypt.genSalt(10)
      otp.otp = await bcrypt.hash(otp.otp , salt)
      const result = await otp.save()
      return res.status(200).send("Otp sent successfully") ;
}

const verifyOtp = async(req, res) => {
    const otpHolder = await Otp.find({
        number: req.body.number
    })

    if(otpHolder.length === 0) return res.status(400).send("You use a expired OTP!");
    const rightOtpFind = otpHolder[otpHolder.length - 1]
    const validUser = await bcrypt.compare(req.body.otp , rightOtpFind.otp) 

    if(rightOtpFind.number === req.body.number && validUser) {
        const user = new User(_.pick(req.body , ["number"])) 
        const token = user.generateJWT()
        const result = await user.save()
        const OTPdelete = await Otp.deleteMany({
            number: rightOtpFind.number
        })
        return res.status(200).send({
            message: "User Registration Successfull!" ,
            token: token ,
            data: result
        })
    } else {
        return res.status(400).send("Your OTP was wrong")
    }
 }

module.exports = {
    signUp ,
    verifyOtp
}