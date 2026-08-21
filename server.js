import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
const app = express();
const PORT = 3000
const mon = mongoose.connect("mongodb://localhost:27017/test").then(()=>console.log("DB is ready"))
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

app.get("/api/accounts", (req,res)=>{
    const {minbalance }= req.query;
    
    if(minbalance){
        const accmin = accounts.filter(a => a.balance >=  minbalance)
        return res.status(200).json({accounts_minbalanced: accmin })
    }
   const all = accounts.map(acc =>({
    name :acc.name ,
    balance: acc.balance
   }))
    return res.json({massege : all})
})

app.get("/api/account/:id",(req,res)=>{
    const Id = req.params.id
    const account = accounts.find(acc=>  acc.id == Id)
    if(!account){
        return res.json({massge : "The account is not here "})
    }
    return res.json({massge : `The account data is: name : ${account.name} -- id : ${account.id}  - balance : ${account.balance}`})   
})

app.post("/api/account", (req,res)=>{
    const {name, balance}= req.body;
    if (balance < 0) {
        return res.json({massge: "Sorry the money should be 0 or more"})
    }
    accounts.push({
        id:accounts.length + 1,
        name ,
        balance

    })
    return res.json({massge : `The account has been created with name : ${name} and balance ${balance}  `})

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