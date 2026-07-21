const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        unqiue:true,
        required:true
    },
    credits:{
        type:Number,
        default:300
    }
},{
    timestamps:true
})

module.exports=mongoose.model('users',userSchema)