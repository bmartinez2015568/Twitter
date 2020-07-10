'use strict'

var express = require("express")
var userController = require("../controller/user.controller")
var md_auth = require("../middleware/authenticated.middleware")

var api = express.Router();
api.post('/commands', md_auth.ensureAuth, userController.commands)

module.exports = api;