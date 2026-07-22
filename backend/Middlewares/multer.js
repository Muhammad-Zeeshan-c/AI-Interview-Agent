const multer=require('multer')

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/')
    },

    filename:function(req,file,cb){
        const name=Date.now()+Math.round(Math.random() * 1E9)+'-'+file.originalname
        cb(null,name)
    }   
})

const upload=multer({storage:storage,
    limits:{fileSize:5*1024*1024}
})

module.exports=upload