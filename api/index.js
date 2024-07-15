const express = require('express');
const cors = require ('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const User = require('./models/User')
require ('dotenv').config()
const app = express();


const bcryptSalt = bcrypt.genSaltSync(10);

//xewuG6w2i1pg9q5z
//mongodb+srv://pkUser:xewuG6w2i1pg9q5z@cluster0.maifd2d.mongodb.net/
//mongodb+srv://pkUser:<password>@cluster0.maifd2d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
app.use(express.json());

app.use (cors({
    credentials:true,
    origin:'http://localhost:3000',
}))

//console.log(process.env.MONGO_URL);
 mongoose.connect(process.env.MONGO_URL);

app.get ('/test',(req,res) =>{
    res.json("tested ok");
});

app.post('/register',async(req,res)=>{
    const {name,email,password} = req.body;
    try{
        const userDoc =  await User.create({
            name,
            email,
            password:bcrypt.hashSync(password,bcryptSalt),
      });
      res.json(userDoc);
    }catch(e){
        res.status(422).json(e);
    }
});

app.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    const userDoc= await User.findOne({email});
    if(userDoc){
        const passwordOk = bcrypt.compareSync(password,userDoc.password)
        if(passwordOk){
         res.json('password correct')
        }else{
          res.status(422).json('password incorrect');
        }
    }else{
        res.json('not found');
    }
})

app.listen(4000,()=>{
   // console.log("running")
});
