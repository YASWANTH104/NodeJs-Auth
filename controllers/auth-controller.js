const User=require('../models/User')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
//register controller
const registerUser=async(req,res)=>{
    try{
        //extract user information from our req body
        const {username,email,password,role}=req.body
        //check if user already exist in the database
        const checkExisitingUser=await User.findOne({$or:[{username},{email}]})
        if(checkExisitingUser){
            return res.status(400).json({
                success:false,
                message:'User is already exisits with same username or same email.Please try with a different username or email'
            })
        }
        //hash user password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        //create a new user
        const newlyCreatedUser=new User({
            username,
            email,
            password:hashedPassword,
            role:role || 'user'
        })

        await newlyCreatedUser.save()
        if(newlyCreatedUser){
            res.status(201).json({
                success:true,
                message:'User registered Successfully'
            })
        }
        else{
            res.status(400).json({
                success:false,
                message:'Unable to register User! Please try again'
            })
        }

    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'Some error occured! please try again'
        })
    }
}


//login controller

const loginUser=async(req,res)=>{
    try{
        const {username,password}=req.body
        const user=await User.findOne({username})
        if(!user){
            res.status(400).json({
                success:false,
                message:'User does not exist'
            })
        }
        const isPasswordMatch=await bcrypt.compare(password,user.password)
        if(!isPasswordMatch){
            res.status(400).json({
                success:false,
                message:"Invalid Credentials"
            })
        }
        //create user token
        const accessToken=jwt.sign({
            userId:user._id,
            username:user.username,
            role:user.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn:'15m'
        })
        res.status(200).json({
            success:true,
            message:'Logged in Successful',
            accessToken
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'Some error occured! please try again'
        })
    }
}

const changePassword=async(req,res)=>{
    const userId=req.userInfo.userId;
    const user=await User.findById(userId)

    //extract old and new password
    const {oldPassword,newPassword}=req.body;
    if(!user){
        return res.status(400).json({
            success:false,
            message:'User not found',
        })
    }
    //Check if password is correct
    const isPasswordMatch=await bcrypt.compare(oldPassword,user.password);
    if(!isPasswordMatch){
        return res.status(400).json({
            success:false,
            message:'Password is not correct ! Please try again!'
        })
    }
    //Hash the new password
    const salt=await bcrypt.genSalt(10)
    const newHashedPassword=await bcrypt.hash(newPassword,salt);
    //update the new password
    user.password=newHashedPassword;
    await user.save();

    res.status(200).json({
        success:true,
        message:'Password updated Successfully'
    })
}


module.exports={registerUser,loginUser,changePassword}