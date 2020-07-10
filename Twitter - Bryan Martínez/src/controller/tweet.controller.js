'use strict'

const Tweet = require("../models/tweet.model")
const User = require("../models/user.model")

exports.addTweet = (req, res, substring) => {

    var owner = req.user.username
    substring.splice(0, 1)
    var descripcion = substring.join(" ")

    if (descripcion) {

        Tweet.findOneAndUpdate({ username: owner }, { $push: { tweets: { description: descripcion } } }, { new: true }, (err, updateTweet) => {

            if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
            if (!updateTweet) return res.status(404).send({ error: "No se ha podido agregar el tweet" })
            if (updateTweet) {

                User.findOneAndUpdate({ username: owner }, { $inc: { "no_tweets": 1 } }, { new: true }, (err, tweetInc) => {

                    if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
                    if (!tweetInc) return res.status(404).send({ error: "No se ha podido agregar el tweet" })
                    if (tweetInc) return res.status(200).send({ tweet: updateTweet })

                })
            }

        })

    } else {
        return res.status(500).send({ error: "No has enviado los datos necesarios" })
    }

}

exports.deletTweet = (req, res, substring) => {

    var owner = req.user.username
    var tweetId = substring[1]

    if (tweetId) {
        Tweet.findOne({ 'tweets._id': tweetId }, (err, tweetFinded) => {
            if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
            if (!tweetFinded) return res.status(404).send({ error: "No se ha encontrado el tweet" })
            if (tweetFinded) {

                Tweet.findOneAndUpdate({ username: owner }, { $pull: { tweets: { _id: tweetId } } }, (err, deleteTweet) => {

                    if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
                    if (!deleteTweet) return res.status(404).send({ error: "No se ha podido eliminar el tweet" })
                    if (deleteTweet) {

                        User.findOneAndUpdate({ username: owner }, { $inc: { "no_tweets": -1 } }, { new: true }, (err, tweetInc) => {

                            if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
                            if (!tweetInc) return res.status(404).send({ error: "No se ha podido decrementar los tweets" })
                            if (tweetInc) return res.status(200).send({ tweetEliminado: deleteTweet })

                        })
                    }

                })

            }
        })

    } else {
        return res.status(500).send({ error: "No has enviado los datos necesarios" })
    }

}

exports.editTweet = (req, res, substring) => {

    var owner = req.user.username
    var tweetId = substring[1]
    substring.splice(0, 2)
    var descripcion = substring.join(" ")

    if (descripcion) {

        Tweet.findOneAndUpdate({ username: owner, 'tweets._id': tweetId }, { "$set": { "tweets.$.description": descripcion } }, { new: true }, (err, updateTweet) => {


            if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
            if (!updateTweet) return res.status(404).send({ error: "No se ha encontrado el tweet" })
            if (updateTweet) return res.status(200).send({ tweetActualizado: updateTweet })

        })

    } else {
        return res.status(500).send({ error: "No has enviado los datos necesarios" })
    }
}

exports.viewTweets = (req, res, substring) => {

    var nickname = substring[1]

    if (nickname) {

        Tweet.findOne({ username: nickname }, (err, tweets) => {

            if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
            if (!tweets) return res.status(404).send({ error: "No existe el usuario" })
            if (tweets) return res.status(200).send({ tweetActualizado: tweets })

        })

    } else {

        return res.status(500).send({ error: "No has enviado los datos necesarios" })

    }

}