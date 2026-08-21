import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true,
        trim: true 
    },
    balance:{
        type:Number,
        default:0,
        trim:true,
        min:0
    },
    username: {
        type:String,
        unique:true,
        require:true
    },
    password:{
        type: String,
        require:true,
        select:false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
},{timestamps:true})

const User = mongoose.model("User", UserSchema)

export default User 