const mongoose=require("mongoose")

async function DBConnect(){
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongodb connected.....")
    }
    catch(error){
        console.log(error)
    }
}

module.exports=DBConnect