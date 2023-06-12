// Authentication Middleware

const jwt = require("jsonwebtoken");
require('dotenv').config();
const redis = require("redis");
const redisClient = redis.createClient(6379)

redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });
  
  redisClient.on('error', (error) => {
    console.error('Redis error:', error);
  });

const auth = (req,res,next)=>{

    const token = req.headers.authorization

    if(!token){
        res.status(404).json({"msg":"User Unauthorized"})
    }

    jwt.verify(token,process.env.jwt_secret,(err,decoded)=>{
        if(err){
            res.status(404).json({"msg":"Invalid Token"})
        }

        redisClient.get(decoded.sub,(rediserr,reply)=>{
            if(rediserr){
                res.status(404).json({"msg":"Internal Server Error"}) 
            }

            if(reply===token){
                res.status(500).json({"msg":"Token is Blacklisted"})
            }
            req.userId = decoded.sub;
            next()
        })
    })
}

module.exports = {
    auth
}