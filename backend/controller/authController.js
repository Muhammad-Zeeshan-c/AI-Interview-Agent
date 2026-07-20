const userSchema=require('../models/userModel')
const getJwtToken=require('../util/token')

const googleAuthController=async(req,res)=>{
    try{
        const {userName,userEmail}=req.body
        let user=await userSchema.findOne({email:userEmail});

        if(!user){
            user=new userSchema({name:userName,email:userEmail})
            await user.save();
        }

        const token=await getJwtToken(user._id.toString())
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json(user)
    }
    catch(error){
        return res.status(500).json({message:`Google Sign in error \n ${error}`})
    }
}

const logout =async (req,res)=>{
    try{
        await res.clearCookie('token')
        return res.status(200).json({message:'loggedOut successfully'})
    }
    catch(error){
        return res.status(500).json({message:`Error while Logging Out \n ${error}`})
    }

}
module.exports={
    googleAuthController,
    logout
}