const mongoose=require('mongoose')
const connectToDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Mongo DB connected Successfully');
    }
    catch(error){
        console.log('MongoDb connection failed',error)
        process.exit(1);
    }
}

module.exports=connectToDB