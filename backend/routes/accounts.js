const express=require("express");
const mongoose=require("mongoose");
const authMiddleware=require('../middleware/auth')
const {Users,Account, Transactions}=require('../db/users');
const zod=require('zod')
const router=express.Router();

const transferSchema=zod.object({
    to:zod.string(),
    amount:zod.number().min(1)
})

//EndPoint to check Balance
router.get('/balance',authMiddleware,async(req,res)=>{
    const account=await Account.findOne({
        userId:req.userId
    })
    const user=await Users.findOne({
        _id:req.userId
    })
    res.json({
        balance:account.balance,
        userId:account.userId,
        name:user.firstName,
        username:user.username
       
    })
})

//EndPoint to transfer Money
router.post('/transfer',authMiddleware,async(req,res)=>{
    const body=req.body;
    const {success}=transferSchema.safeParse(body);
    if(!success){
        return res.json({
            "msg":"Invalid Credentials"
        })
    }
    
    try{
    const session=await mongoose.startSession();
    
    session.startTransaction();
    const {amount,to}=req.body;

    const account=await Account.findOne({
        userId:req.userId
    })

    if(account.balance<amount || amount<0){
        res.json({
            "msg":"Insufficient Balance"
        })
        return;
    }
    const toAccount=await Account.findOne({
        userId:to
    })
    if(!toAccount){
        res.json({
            message:"User Not Found"
        })
        return;
    }

    await Account.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session);
    await Account.updateOne({userId:to},{$inc:{balance:amount}}).session(session);
    const transaction = new Transactions({
        fromId: account.userId, // Assuming 'account' and 'toAccount' are defined earlier
        toId: toAccount.userId,
        amount: amount,
        date: new Date() // Using new Date() to get the current date/time
    });
    
    await transaction.save();

    await session.commitTransaction();
    res.json({
        "msg":"Transfer Complete"
    })}
    catch{
        res.json({
            "msg":"Transfer Incomplete"
        })
    }

})


// Endpoint to check transaction history
router.post('/history', authMiddleware, async (req, res) => {
    const userId = req.userId;
    
    try {
        const sentTransactions = await Transactions.find({ fromId: userId });

        const receivedTransactions = await Transactions.find({ toId: userId });

        const allTransactions = [...sentTransactions, ...receivedTransactions];

        const user = await Users.findOne({ _id: userId });

        const history = await Promise.all(allTransactions.map(async (transaction) => {
            const isSender = transaction.fromId.toString() === userId.toString();

            const otherPartyId = isSender ? transaction.toId : transaction.fromId;
            const otherParty = await Users.findOne({ _id: otherPartyId });

            return {
                fromName: isSender ? user.firstName + " " + user.lastName : otherParty.firstName + " " + otherParty.lastName,
                toName: isSender ? otherParty.firstName + " " + otherParty.lastName : user.firstName + " " + user.lastName,
                amount: transaction.amount,
                date: transaction.date,
                type: isSender ? 'Sent' : 'Received'
            };
        }));

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching transaction history' });
    }
});



module.exports=router;