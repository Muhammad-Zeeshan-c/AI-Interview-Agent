const express=require('express')
const dotenv=require('dotenv')
const connectMongoose=require('./config/connectDatabase')

const cookieParser=require('cookie-parser')
const cors=require('cors')

//Routes
const authRouter=require('./Routes/authRoute')
const userRouter=require('./Routes/userRoute')
const interViewRouter=require('./Routes/interviewRoute')

//Middle Wares
const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {
        origin:'http://localhost:5173',
        credentials:true,
        methods:['GET','POST','PUT','DELETE','OPTIONS']
    }
))


dotenv.config()
const port=process.env.PORT || 5000
const url=process.env.DB_URL

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/interview',interViewRouter)


app.listen(port,async ()=>{
    console.log(`App is working ${port}`)
    await connectMongoose(url).then(()=>{
        console.log('DB Connected')
    })
    

})