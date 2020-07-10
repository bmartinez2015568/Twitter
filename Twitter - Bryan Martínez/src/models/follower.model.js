'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowerSchema = Schema({
    username: String,
    followers: [{
        username: String,
    }]
})

module.exports = mongoose.model('follower', FollowerSchema);