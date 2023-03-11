require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')


const app = express() ;

// middleware 
app.use(express.json()) ;

app.use((req , res , next) => {
    console.log(req.path , req.method)
    next()
})

// Routes
app.use('/api/user' , userRoutes)


// Connect to database
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT , (req,res)=> {
            console.log("Listning to" , process.env.PORT) ;
        })
    })
    .catch((error) => {
        console.log(error) 
    })

