'use strict'

var express = require("express")
var app = express()
var bodyParser = require("body-parser")

var user_routes = require("./routes/user.routes")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authoruzation, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')

    next();
})

app.use('/api', user_routes)

module.exports = app;