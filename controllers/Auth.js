const bcrypt = require("bcrypt");
const User = require("../model/User");
const jwt=require('jsonwebtoken')
require("dotenv").config()
//Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "error in hashing password",
      });
    }
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    res.status(200).json({
      success: true,
      message: "user created successfully",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "user cannot be register please try again later",
    });
  }
};
//login
exports.login = async (req,res) => {
try{
    //fetching email,pass
    console.log(req.body)
    const {email,password}=req.body;
    //checking email and pass filled or not
    if(!email || !password) return res.status(400).json({
        success:false,
        message:"please fill all fields"
    });
    //check for registered user
    const user=await User.findOne({email});
    if(!user){
        return res.status(401).json({
            success:false,
            message:"User not found"
        });
    }

    //compare password
    const payload={
        email:user.email,
        id:user._id,
        role:user.role
    }
    if (await bcrypt.compare(password,user.password)){
        //creating token
        let token=jwt.sign(payload,`${process.env.JWT_SECRET}`,  {
            expiresIn:"2h",
        });
        user.token=token;
        user.password=undefined;
        const options={
            expires: new Date(Date.now()+3 *24*60*60*100),
            httpOnly:true,
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"user logged in successfully"
        })
    }
    else{
        return res.status(403).json({
            success:false,
            message:"Wrong password"
        })
    }
}
catch(e){
    console.log(e);
   
}
};
