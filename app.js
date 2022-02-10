const express = require("express");
const app = express();

const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3000;

const router = require("./routers/router")

app.use("", router);

app.listen(PORT, () => console.log(`Server at ${PORT}`));
