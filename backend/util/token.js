const JWT=require('jsonwebtoken')

const getJwtToken=async=(userID)=>{
    try {

        const token=JWT.sign({userID},process.env.JWT_SECRET_KEY,{expiresIn:'7d'})
        return token
        
    } catch (error) {
        console.error('Error generating JWT token:', error);
        throw new Error('Failed to generate JWT token');
    }
}

module.exports=getJwtToken