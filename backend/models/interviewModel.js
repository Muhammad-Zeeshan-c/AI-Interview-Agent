const mongoose=require('mongoose')
const questionSchema = new mongoose.Schema({
    question:String,
    difficulty:String,
    timeLimit:Number,
    answer:String,
    feedback:String,
    score:{
        type:Number,
        default:0
    },
    confidence:{
        type:Number,
        default:0
    },
    communication:{
        type:Number,
        default:0
    },
    correctness:{
        type:Number,
        default:0
    }
})

const interviewSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    },

    role:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    mode:{
        type:String,
        required:true,
        enum:['HR','technical']
    },
    resumeText:{
        type:String,

    },
    questions:[questionSchema],
    finalScore:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        enum:['Incomplete','completed'],
        default:'Incomplete'      
    }

},{timestamps: true})

const InterviewModel=mongoose.model('interviews',interviewSchema)

module.exports={InterviewModel}