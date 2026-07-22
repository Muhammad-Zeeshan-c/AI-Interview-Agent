const express=require('express')
const interViewRouter=express.Router()
const {analyzeResume}=require('../controller/interviewController.js')
const isAuth=require('../Middlewares/isAuth.js')
const upload=require('../Middlewares/multer.js')

interViewRouter.post('/resume',isAuth,upload.single('resume'),analyzeResume)


module.exports=interViewRouter
