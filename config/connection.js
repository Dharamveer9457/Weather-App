const mongoose = require("mongoose");
require('dotenv').config()

const connection = mongoose.connect(process.env.mongoURL)
.then(()=>console.log("Connected to MongoDB Atlas"))
.catch((error)=>console.log(error))

module.exports = {
    connection
}
