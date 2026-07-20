const JWT=require('jsonwebtoken')

const getJwtToken=async=(userID)=>{
    try {

        const token=JWT.sign({userID},process.env.JWT_SECRET_KEY,{expiresIn:'7d'})
        console.log(token)
        return token
        
    } catch (error) {
        console.log(error)
    }
}

module.exports=getJwtToken