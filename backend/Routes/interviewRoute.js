const express=require('express')
const interViewRouter=express.Router()
const {analyzeResume}=require('../controller/interviewController.js')
const isAuth=require('../Middlewares/isAuth.js')
const upload=require('../Middlewares/multer.js')
const {generateQuestions}=require('../services/openRouterService.js')
const {finishInterview}=require('../services/openRouterService.js')
const {submitAnswer}=require('../services/openRouterService.js')

interViewRouter.post('/resume',isAuth,upload.single('resume'),analyzeResume)
interViewRouter.post('/generate-questions',isAuth,generateQuestions)
interViewRouter.post('/submit-answer',isAuth,submitAnswer)
interViewRouter.post('/finish-interview',isAuth,finishInterview)

module.exports=interViewRouter
