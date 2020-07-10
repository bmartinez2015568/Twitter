'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = Schema({
    username: String,
    tweets: [{
        description: String
    }]
})

module.exports = mongoose.model('tweet', TweetSchema);