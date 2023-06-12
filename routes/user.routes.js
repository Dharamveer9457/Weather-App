const express = require("express");
const {userModel} = require("../models/user.model");
const jwt = require("jsonwebtoken");
const userRouter = express.Router()
const {auth} = require("../middlewares/auth");
require('dotenv').config();
const redis = require("redis");
const { Logger } = require("winston");
const redisClient = redis.createClient(6379)
redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });
  
  redisClient.on('error', (error) => {
    console.error('Redis error:', error);
  });

// Register new user

userRouter.post("/register",async(req,res)=>{
    const {name,email,password,city} = req.body
    try {
        let user = new userModel(req.body)
        await user.save()
        res.status(200).json({"msg":"New user has been registered"})
    } catch (error) {
        res.status(404).json({"msg":"Error while registering user", "error":error})
    }
})

// Login route for user

userRouter.post("/login", async(req,res)=>{
    const {email,password} = req.body
    try {
        let user = await userModel.find({email})
        if (user.length>0){
            let token = jwt.sign({userId:user[0]._id}, process.env.jwt_secret)
            res.status(200).json({"msg":"Login Successfull", "token":token})
        }else{
            res.status(404).json({"msg":"User not registered"})
        }
    } catch (error) {
        res.status(404).json({"msg":"Wrong Credentials"})
    }
})

// Logout route for users

userRouter.post("/logout",auth, async(req,res)=>{
    const token = req.headers.authorization;
    const userId = req.userId

    redisClient.set(userId,token,'EX',1800,(err)=>{
        if(err){
            res.status(404).json({"msg":"Failed to blacklist token"})
        }

        res.status(200).json({"msg":"Logout Successfull"})
    })

})


module.exports = {
    userRouter
}


