const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://admin:j9sG3ZSmzkSi3Sid@cluster0.gtd9ato.mongodb.net/payTm");

const userSchema=new mongoose.Schema({
    username:String,
    firstName:String,
    lastName:String,
    email:String,
    password:String
})

const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    balance:{
        type:Number,
        default:0
    }
})
const transactionSchema=new mongoose.Schema({
    fromId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
    }
})

const Users=mongoose.model('User',userSchema)
const Account=mongoose.model('Account',accountSchema)
const Transactions=mongoose.model('Transactions',transactionSchema)

module.exports={
    Users,
    Account,
    Transactions
}