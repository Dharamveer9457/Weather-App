const express = require("express");
const app = express()
require('dotenv').config()
const {connection} = require("./config/connection");
const {userRouter} = require("./routes/user.routes");
const {weatherRouter} = require("./routes/weather.routes");

const winston = require("winston")
require('winston-mongodb');

const look = 12345

// Winston Logger 
const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.MongoDB({ db: process.env.mongoURL, collection:"logs"})
    ],
    format : winston.format.combine(winston.format.timestamp(),winston.format.json())
  });


app.use(express.json())
app.use("/users",userRouter)
app.use("/weather",weatherRouter)


app.listen(8080,async()=>{
    try {
        await connection
        console.log("Server is running at 8080")
    } catch (error) {
        console.log("Error while connecting to server")
    }
})
