const express=require('express')
const userRouter=express.Router()
const getCurrentUser=require('../controller/userController')
const isAuth=require('../Middlewares/isAuth')


userRouter.get('/currentuser',isAuth,getCurrentUser)

module.exports=userRouter

