const express = require("express");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const userModel = require("../models/userModel");
const {validateEmail} = require("../Controllers/registration");
const bcryptjs = require("bcryptjs");
const maxSession = 3;

app.use(cookieParser());
app.use(
  session({ secret: process.env.SECRET, saveUninitialized: true, resave: true })
);

async function loginUser(req, res) {
  
  try {
    let { email, password } = req.body;
    //checking for invalid inputs
  if (!email || !password || !validateEmail(email))
  return res.status(400).json({
    error: "Invalid Input",
  });

    let user = await userModel.findOne({ email_address: email });
    //converting to plain javascript object
    
    if (!user)
    return res.status(400).json({
      error: "No user found",
    });
    
    user = user.toObject();
    
    console.log("loggedIn_user : ",user);
    //comparing password
    if (bcryptjs.compareSync(password, user.password)) {
      console.log("password matched");
      //checking active sessions
      if (req.session.active) {
        if (req.session.active == maxSession)
          return res.status(401).json({ message: "max connection reached" });
        else req.session.active++;
      } else req.session.active = 1;
      req.session.save();
      
       //remove password from user object before returning response
       delete user["password"];
      
      res.status(200).json({
        message: "User logged in",
        user: user,
        active_sessions: req.session.active,
      });
    } else
      return res.status(400).json({
        error: "Invalid login credentials",
      });
  } catch (error) {
    res.status(500).json({
      message : "Error Occured",
      error: error.message,
    });
  }
}
function logoutUser(req, res) {
  req.session.destroy();
  return res.send("User logged out!");
}

module.exports.loginUser = loginUser;
module.exports.logoutUser = logoutUser;
