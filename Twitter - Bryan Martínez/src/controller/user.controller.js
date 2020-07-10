'use strict'

const User = require("../models/user.model")
const Tweet = require("../models/tweet.model")
const Follower = require("../models/follower.model")
const Following = require("../models/following.model")
const bcrypt = require("bcrypt-nodejs")
const jwt = require("../services/jwt.service")

const tweetController = require("./tweet.controller")
const followsController = require("./follows.controller")

exports.commands = (req, res) => {

    var params = req.body
    var substring = params.commands.split(" ")
    var stringValidation = substring[0].toLowerCase()

    switch (stringValidation) {
        case "register":
            register(res, substring)
            break
        case "login":
            login(res, substring)
            break
        case "profile":
            profile(res, substring)
            break
        case "add_tweet":
            tweetController.addTweet(req, res, substring)
            break
        case "delete_tweet":
            tweetController.deletTweet(req, res, substring)
            break
        case "edit_tweet":
            tweetController.editTweet(req, res, substring)
            break
        case "view_tweets":
            tweetController.viewTweets(req, res, substring)
            break
        case "follow":
            followsController.followUser(req, res, substring)
            break
        case "unfollow":
            followsController.unfollowUser(req, res, substring)
    }

}

function register(res, substring) {

    var user = new User();
    var tweet = new Tweet();
    var follower = new Follower();
    var following = new Following();
    var username = substring[1]
    var password = substring[2]

    if (username && password) {

        user.username = username
        user.password = password

        User.find({ username: user.username }).exec((err, users) => {

            if (err) return res.status(500).send({ message: "Error al hacer la petición" })
            if (users && users.length >= 1) {
                return res.status(200).send({ message: "El usuario ya existe" })
            } else {
                bcrypt.hash(user.password, null, null, (err, hash) => {
                    user.password = hash;
                    user.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ message: "Error en la peticion al guardar" })
                        if (usuarioGuardado) {
                            tweet.username = username
                            tweet.tweets = []
                            tweet.save((err, saved) => {
                                if (err) return res.status(500).send({ message: "Error al generar tweets" });
                                if (!saved) return res.status(400).send({ message: "No se ha podido crear tweets" });
                            })
                            follower.username = username
                            follower.followers = []
                            follower.save((err, saved) => {
                                if (err) return res.status(500).send({ message: "Error al generar followers" });
                                if (!saved) return res.status(400).send({ message: "No se ha podido crear tweets" });
                            })
                            following.username = username
                            following.followings = []
                            following.save((err, saved) => {
                                if (err) return res.status(500).send({ message: "Error al generar followings" });
                                if (!saved) return res.status(400).send({ message: "No se ha podido crear tweets" });
                            })
                            return res.status(200).send({ user: usuarioGuardado })
                        } else {
                            return res.status(200).send({ message: "No se pudo registar el usuario" })
                        }
                    })
                })
            }

        })

    } else {
        return res.status(500).send({ error: "No has ingresado todos los datos" })
    }
}

function login(res, substring) {

    var username = substring[1]
    var password = substring[2]
    if (substring[3]) {
        var gettoken = substring[3].toLowerCase() == "true" ? true : false
    } else {
        return res.status(500).send({ error: "Debes generar el token en la linea de comandos" })
    }

    User.findOne({ username: username }, (err, usuario) => {
        if (err) return res.status(500).send({ message: "Error en la particion" })
        if (usuario) {
            bcrypt.compare(password, usuario.password, (err, check) => {
                if (check) {
                    if (gettoken) {
                        return res.status(200).send({
                            token: jwt.createToken(usuario)
                        })
                    } else {
                        return res.status(200).send({ error: "El comando para generar el token no es válido" })
                    }
                } else {
                    return res.status(404).send({ message: "No se ha encontrado al usuario" })
                }
            })
        }
        else {
            return res.status(500).send({ message: "No has podido ingresar" })
        }
    })

}

function profile(res, substring) {

    var nickname = substring[1]

    if (nickname) {

        User.findOne({ username: nickname }, (err, user) => {

            if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
            if (!user) return res.status(404).send({ error: "No existe el usuario" })
            if (user) {
                Tweet.findOne({ username: nickname }, (err, tweets) => {

                    if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
                    if (!tweets) return res.status(404).send({ error: "No se han encontrado los tweet" })
                    if (tweets) {
                        user.password = undefined
                        tweets.username = undefined
                        return res.status(200).send({ profile: user, tweets })
                    }

                })
            }
        })

    } else {

        return res.status(500).send({ error: "No has enviado los datos necesarios" })

    }
}