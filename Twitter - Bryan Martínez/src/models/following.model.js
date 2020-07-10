'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowingSchema = Schema({
    username: String,
    followings: [{
        username: String
    }]
})

module.exports = mongoose.model('following', FollowingSchema);