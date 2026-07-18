const express=require('express')
const dotenv=require('dotenv')
const connectMongoose=require('./config/connectDatabase')

const app=express()


dotenv.config()
const port=process.env.PORT || 6000
const url=process.env.DB_URL

app.get('/',(req,res)=>{
    res.json({message:'server Started'})
})

app.listen(port,async ()=>{
    console.log(`App is working ${port}`)
    await connectMongoose(url).then(()=>{
        console.log('DB Connected')
    })
    

})