const exp=require('express');
const app=exp();    
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
const PORT=process.env.PORT || 3000;
app.use(exp.json())

mongoose.connect("mongodb://localhost:27017/temp")
    .then(()=>{
        console.log("DB connection success")
        app.listen(PORT,()=>console.log(`http server on port ${PORT}`))
    })
    .catch((err)=>console.log("err in DB",err));

app.use((err,req,res,next)=>{
    res.status(500).send({message:"Error",payload:err.message})
})