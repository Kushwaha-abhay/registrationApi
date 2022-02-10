const express = require("express");
const router = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv').config();

router.use(cookieParser());
router.use(session({ secret: process.env.SECRET, saveUninitialized: true, resave: true }));

const { getName_Mobile,getEmail_Pwd, getPan_DOB_FatherName } = require("../controllers/registration");
const {loginUser,logoutUser} = require("../controllers/login");
router.use(express.json());


router.post("/step1",getName_Mobile);
router.post("/step2",getEmail_Pwd);
router.post("/step3",getPan_DOB_FatherName);
router.post("/login",loginUser);
router.post("/logout",logoutUser);


module.exports = router;