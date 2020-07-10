'use strict'

var jwt = require("jwt-simple")
var moment = require("moment")
var secret = 'password'

exports.createToken = function(user){
    var payload={
        sub: user._id,
        username: user.username,
        no_followers: user.no_followers,
        no_following: user.no_following,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix()
    }

    return jwt.encode(payload, secret)
}