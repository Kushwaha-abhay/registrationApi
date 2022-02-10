const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
const DB_LINK = process.env.DB_LINK;
mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => console.log("dB connected..!!"));

let userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email_address: {
    type: String
  },
  password : {
    type : String
  },
  mobile_number: {
    type: String,
  },
  pan_number: {
    type: String,
  },
  date_of_birth: {
    type: String,
    
  },
  father_name : {
      type : String
  }
});

let userModel = mongoose.model("userCollection", userSchema);
module.exports = userModel;
