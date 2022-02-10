const express = require("express");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const bcryptjs = require("bcryptjs");
const userModel = require("../models/userModel");
app.use(cookieParser());
app.use(
  session({ secret: process.env.SECRET, saveUninitialized: true, resave: true })
);

let user = {};

function getName_Mobile(req, res) {
  let { name, mobile } = req.body;
//checking for invlaid inputs
  if (!name || !mobile || !(mobile.length == 10))
    return res.status(400).json({
      error: "Invalid Input",
    });

  console.log("Step1 : " + name + " " + mobile);

  user.name = name;
  user.mobile_number = mobile;
  req.session.step = 1;

  return res.status(200).json({
     status : "Step1 complete",
   });
}

function getEmail_Pwd(req, res) {
  //if step1 is not completed then step2 not allowed
  if (!req.session.step)
    return res.status(400).json({
      error: "Steps not followed",
    });

  let { email, password } = req.body;
//checking for invalid inputs
  if (!email || !password || !validateEmail(email))
    return res.status(400).json({
      error: "Invalid Input",
    });

  console.log("Step2 : " + email + " " + password);
//hashing password
  let salt = bcryptjs.genSaltSync(10);
  let hashedPassword = bcryptjs.hashSync(password, salt);
  user.email_address = email;
  user.password = hashedPassword;

  req.session.step = 2;

  return res.status(200).json({
    status : "Step2 complete"
  });
}

async function getPan_DOB_FatherName(req, res) {
  try {
  //if step1 and step2 is not completed then step3 not allowed
  if (!(req.session.step == 2))
    return res.status(400).json({
      error: "Steps not followed",
    });

  let { pan, dob, fatherName } = req.body;
  //checking for invalid inputs
  if (!pan || !dob || !fatherName)
    return res.status(400).json({
      error: "Invalid Input",
    });

  console.log("Step 3 : "+pan + " " + dob + " " + fatherName);
  user.pan_number = pan;
  user.date_of_birth = dob;
  user.father_name = fatherName;

  let newUser = await userModel.findOne({ email_address: user.email_address });
  console.log(newUser);
  if (newUser)
    return res.status(400).json({
      message: "user already exisit",
    });
  else {
    //storing new data in DB
    await userModel
      .create(user)
      .then((res) => console.log("success in storing to DB"))
      .catch((err) => {
        console.error({ error: err });
      });
  }
  //remove password from user object before returning response
  delete user["password"];
  
  res.status(200).json({
    message: "Registration Success",
    user: user,
  });
}
catch(err){
  res.status(500).json({
    message :"Error occured",
    error :err.message
  })
}
}
//to validate email format(abc@abc.com)
function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

module.exports.getName_Mobile = getName_Mobile;
module.exports.getEmail_Pwd = getEmail_Pwd;
module.exports.getPan_DOB_FatherName = getPan_DOB_FatherName;
module.exports.validateEmail = validateEmail;
