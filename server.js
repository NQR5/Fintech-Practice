import express from "express";
const app = express();
const PORT = 3000

app.use(express.json());

const accounts = [
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
        return res.json({accounts_minbalanced: accmin })
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
    return res.json({massge : `The account data is: name : ${account.name} -- id : ${account.id} -- balance : ${account.balance}`})   
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
    return res.json({massege: to})
    }
    return res.status(200).json({massege: `Your accounts now is ${from.balance} and trans to ${to.name} with ${to.balance}`})
})
app.listen(PORT,()=>{
    console.log(`server is listing right now on port ${PORT}` );
})