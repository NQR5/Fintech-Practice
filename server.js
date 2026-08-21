import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import User from "./Models/User.js"

const app = express();
const PORT = 3000
const mon = mongoose.connect("mongodb://localhost:27017/digitalWalet").then(()=>console.log("DB is ready"))
app.use(express.json());

let accounts = [
    {
        id:1,
        name:"nawaf",
        balance: 150
    },
    
    {
        id:2,
        name:"Bander",
        balance: 250    
    },

    {
        id:3,
        name:"Ahmed",
        balance: 10000
    }
    
]

app.get("/", (req,res)=>{
    res.json({massege:"The get is working right now"})
})

app.get("/api/accounts",async (req,res)=>{
    const {minbalance }= req.query;
    
    if(minbalance){
        const accmin = accounts.filter(a => a.balance >=  minbalance)
        return res.status(200).json({accounts_minbalanced: accmin })
        const users = await User.find({balance: {$gte : minbalance}})
        .select("name username role balance")
        .sort({balance : -1})
    }
   const all = accounts.map(acc =>({
    name :acc.name ,
    balance: acc.balance
   }))

        const users =await User.find()
        .select("name username role balance")
        .sort({balance : -1})
    return res.json({massege : all, users:users})
})

app.get("/api/account/:id",(req,res)=>{
    const Id = req.params.id
    const account = accounts.find(acc=>  acc.id == Id)
    if(!account){
        return res.json({massge : "The account is not here "})
    }
    return res.json({massge : `The account data is: name : ${account.name} -- id : ${account.id}  - balance : ${account.balance}`})   
})

app.post("/api/account",async (req,res)=>{
    const {name,  username , password}= req.body;

    if(!name || !username || !password){
         return res.status(400).json({massge: "Sorry can't add an account without username or name or password"})
    }

    const exixt = await User.findOne({username})
    if (exixt){
        return res.status(400).json({massge: "the username is already signed in"})
    }
    const user =await   User.create({
        username : username ,
        name : name ,
        password:password,
       
    })
    return res.json({user:user})

})

app.put('/api/transision/:id' ,(req,res )=>{
    const Idfrom = req.params.id;
    let  {balance, Idto} = req.body;
    const from = accounts.find(acc => acc.id == Idfrom)
    const to = accounts.find(acc => acc.id == Idto)
    if( balance && from.balance >= balance && to){
    from.balance -= balance
    to.balance += balance
    return res.status(200).json({massege:  `Your accounts now is ${from.balance} and deposit to ${to.name} with ${to.balance}`})
    }
    return res.status(200).json({massege:`Sorry there is a problem `})
})

app.put("/api/accounts/:id/withdraw", (req,res )=>{
    const Id = req.params.id;
    const {amount } = req.body;
    const acc = accounts.find(a => a.id == Id)
    if(acc){
        if(acc.balance < amount){
            return res.status(400).json({massege: `Your account doesn't have this money , this in your account : ${acc.balance} `})
    }
    acc.balance -= amount
    return res.status(200).json({massege: `take the cash and there is the rest in your account ${acc.balance} `})
    }
    return res.status(400).json({massege: `the account is not here`})
})

app.delete("/api/accounts/:id",(req,res)=>{
    const Id = req.params.id;
    const acc = accounts.find(a => a.id== Id);
    if(acc ){
       accounts = accounts.filter(acc => acc.id != Id )
       return res.status(200).json({massege: `the delete is Done with this account id: ${acc.id} and name : ${acc.name}`}) 
    }
    return res.status(400).json({massege: `Not Found`})
})
app.listen(PORT,()=>{
    console.log(`server is listing right now on port ${PORT}` );
})