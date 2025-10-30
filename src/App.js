const express=require("express")
const cors = require('cors')

class App{
    constructor(){
        this.app=express();
        this.app.use(cors())
    }
    routes(){
        this.app.use("/",(req,res)=>{
            res.json({msg:"your server is ready"})
        })
    }
    middlewares(){
         this.app.use(express.json());
    }
    listen(port){
        this.app.listen(port,()=>{
            console.log(`app is running at http://localhost:${port}`)
        })
    }
}
module.exports=App