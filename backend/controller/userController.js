const userSchema=require('../models/userModel')

const getCurrentUser=async (req,res)=>{
    try{
        const userID=req.userId;
        console.log(req.body,'00')
        console.log(userID,'---')
        const user=await userSchema.findById(userID)
        console.log(user)
        if(!user){
            return res.status(404).json({message:'Please Signup'})
        }

        return res.status(200).json(user)
    }
    catch(err){
        console.error(err)
        return res.status(500).json({message:`An unexpected error occured ${err}`})
    }
}

module.exports=getCurrentUser