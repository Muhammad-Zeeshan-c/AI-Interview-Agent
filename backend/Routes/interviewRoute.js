const express=require('express')
const interViewRouter=express.Router()
const {analyzeResume}=require('../controller/interviewController.js')
const isAuth=require('../Middlewares/isAuth.js')
const upload=require('../Middlewares/multer.js')
const {generateQuestions}=require('../controller/interviewController.js')
const {submitAnswer}=require('../controller/interviewController.js')
const {finishInterview}=require('../controller/interviewController.js')
const {getInterviews}=require('../controller/interviewController.js')
const {getInterviewReport}=require('../controller/interviewController.js')

interViewRouter.post('/resume',isAuth,upload.single('resume'),analyzeResume)
interViewRouter.post('/generate-questions',isAuth,generateQuestions)
interViewRouter.post('/submit-answer',isAuth,submitAnswer)
interViewRouter.post('/finish-interview',isAuth,finishInterview)
interViewRouter.get('/report/:id',isAuth,getInterviewReport)
interViewRouter.get('/details',isAuth,getInterviews)

module.exports=interViewRouter
