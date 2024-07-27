const express=require("express");
const mongoose=require("mongoose");
const router=express.Router();
const authMiddleware=require('../middleware/auth')
const nodemailer=require('nodemailer')
const {Users,Account}=require('../db/users');
const jwt=require("jsonwebtoken");
const {JWT_SECRET}=require("../config");
const zod=require("zod");
const bcrypt = require("bcrypt")
const crypto=require('crypto')
const saltRounds = 10

//SignUp validations
const signUpSchema=zod.object({
    username:zod.string().min(3),
    email:zod.string().email(),
    password:zod.string().min(6),
    firstName:zod.string(),
    lastName:zod.string(),
});

//Login Validations
const loginSchema=zod.object({
    username:zod.string(),
    password:zod.string()
})

//Update Validations
const updateSchema=zod.object({
    password:zod.string().min(6).optional(),
    firstName:zod.string().optional(),
    lastName:zod.string().optional()

}).strict();

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port:465,
    auth: {
        user: 'payease917@gmail.com',
        pass: 'iokmsltoiabeqqkm'
    }
});

const otpStorage={}

//signUp EndPoint
router.post('/signup',async(req,res)=>{
    const body=req.body;

    //Applying Validations on credentials passed
    const {success}=signUpSchema.safeParse(body);
    if(!success){
        res.json({
            "msg":"Invalid Credentials",
            "error":"Username and password should contain 3 and 6 characters respectively"
        })
        return;
    }

    //To check Wheather username/email already exists
    const existingUser=await Users.findOne({
        username:body.username,
    });
    const existingEmail=await Users.findOne({
        email:body.email,
    });
    if(existingUser || existingEmail){
        res.json({
            "msg":"User with same UserName or Email already exists"
        });
        return;
    };

    // Generate OTP and send email
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    otpStorage[body.email] = { otp };
    console.log(otp);
    // console.log(expiresAt)
    const mailOptions = {
        from: 'payease917@gmail.com',
        to: body.email,
        subject: 'Your OTP Code for Regestering to PayEase',
        text: `Your OTP code is ${otp}. It will expire in 10 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.json({ "msg": "Error sending OTP" });
            return;
        }
        
       
    });
     
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(req.body.password, salt)
        res.json({ 
            "msg": "OTP sent successfully",
            "password":hash
         });
    
})

//Login Endpoint
router.post('/login',async(req,res)=>{
    const body=req.body;
    const {success}=loginSchema.safeParse(body);
    if(!success){
        res.json({
            "msg":"Invalid Credentials"
        })
        return;
    }
    const user=await Users.findOne({username:body.username});
    if(user){
    const isMatch=await bcrypt.compare(body.password,user.password)
    if((!isMatch) ){
        res.json({
            "msg":"Invalid Credentials"
        })
        return;
    }
    }
    if(!user){
        res.json({
            "msg":"Invalid Credentials"
        })
        return;
    }
    //Getting a Jwt token
    const userId=user._id;
    const token=jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        "msg":"Login success!",
        "token":token
    });
})

//Update endpoint
router.put('/',authMiddleware,async(req,res)=>{
    const {success} = updateSchema.safeParse(req.body);
    console.log(success);
    if (!success) {
        res.status(403).json({
            "msg":"Error while updating"
        })
        return;
    }
    await Users.updateOne({ _id: req.userId }, // Filter
        { $set: req.body }
    );
    res.json({
        "msg":"User updated successfully"
    })
})

//me endpoint
router.post('/me',authMiddleware,async(req,res)=>{
    const user=await Users.findOne({_id:req.userId});
    res.json({
        username:user.username,
        firstName:user.firstName,

    });
})

//Search for users
router.get("/bulk",authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";
  
    // Create the regex pattern to match initial letters
    const regexPattern = filter ? `^${filter}` : "";
  
    const users = await Users.find({
      $or: [
        { firstName: { "$regex": regexPattern, "$options": "i" } },
        { lastName: { "$regex": regexPattern, "$options": "i" } },
        { username: { "$regex": regexPattern, "$options": "i" } }
      ]
    });
  
    res.json({
      user: users.map(user => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id
      }))
    });
  });
  
// OTP verification and user creation
router.post('/verify', async (req, res) => {
    const { email, otp,username,firstName,lastName,hash } = req.body;

    const otpData = otpStorage[email];
    if (!otpData || otpData.otp !== otp) {
        res.json({ "msg": "Invalid or expired OTP" });
        return;
    }

    // Remove OTP after successful verification
    delete otpStorage[email];

    const dbUser = await Users.create({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    const dbAccount = await Account.create({
        userId: dbUser._id,
        balance: parseInt(1 + (Math.random() * 1000))
    });

    const userId = dbUser._id;
    const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({
        "msg": "User created successfully",
        "token": token
    });
});


module.exports=router;