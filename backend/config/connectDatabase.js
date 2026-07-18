const Mongoose=require('mongoose')
const dns=require('node:dns')

dns.setServers(['8.8.8.8','1.1.1.1'])

async function connectMongoose(url) {
   try{
    await Mongoose.connect(url)
   }
   catch(error){
    console.log('An unexpected error has occured \n',error)
   }
}


module.exports=connectMongoose