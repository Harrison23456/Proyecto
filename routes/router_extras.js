const express = require('express');
const expressLayoutes = require('express-ejs-layouts');

const app = express.Router();
const verify = require("./verifyToken");

app.get("/extras/help", verify, async function (req, res){
  res.render('extras/help.ejs')
});

module.exports = app;