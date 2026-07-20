const express=require('express')
const authRouter=express.Router()
const {googleAuthController}=require('../controller/authController')
const {logout}=require('../controller/authController')

authRouter.post('/google',googleAuthController)
authRouter.get('/',logout)

module.exports=authRouter