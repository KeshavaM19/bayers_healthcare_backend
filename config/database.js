const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/healthcare', { useNewUrlParser: true })
    .then(() => {
    console.log("connect to db")
    })
    .catch((err) => {
    console.log("Error connecting db",err)
    })
    
module.exports = {
    mongoose 
}