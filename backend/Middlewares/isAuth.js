const JWT=require('jsonwebtoken')

const isAuth=(req,res,next)=>{
    try{
        let token=req.cookies.token;
        

        if(!token){
            return res.status(400).json({message:'Please Loggin'})
        }

        let verifyToken=JWT.verify(token,process.env.JWT_SECRET_KEY)

        if(!verifyToken){
            return res.status(400).json({message:'Please Loggin'})
        }
        
        req.userId=verifyToken.userID;
        next();
    }
    catch(err){
        console.error(err)
        return res.status(500).json({message:`An unexpected error occured ${err}`})
    }
}

module.exports=isAuth