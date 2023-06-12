const express = require("express");
const {auth} = require("../middlewares/auth");
const {rateLimiter} = require("../middlewares/rateLimiter");
const {cityValidation} = require("../middlewares/cityValidation");
const redis = require("redis");
const { Logger } = require("winston");
const redisClient = redis.createClient(6379)
redisClient.on('error', err => console.log('Redis Client Error', err));
const axios = require('axios');
const weatherRouter = express.Router()

// Endpoint for weather check
weatherRouter.get("/weather",auth,(req,res)=>{
    const city = req.query.city

    redisClient.get(city,(redisErr,reply)=>{
        if(redisErr){
            res.status(504).json({"msg":"Unable to fetch data"})
        }
        if(reply){
            res.status(200).json(JSON.parse(reply))
        }
        axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=c28d1ccd8afc12dabc1b5a07c50d8c27`)
        .then((res)=>{
            const weatherData = res.data

            redisClient.setEx(city,1800,JSON.stringify(weatherData))

            res.status(200).json(weatherData)
        })

        .catch((error)=>{
            Logger.error(`Failed to fetch ${city}'s weather data:`,error)
            res.status(504).json({"msg":"Unable to fetch data"})
        })
    })
})


// module.exports = {
//     weatherRouter
// }