'use strict'

const Following = require("../models/following.model")
const Follower = require("../models/follower.model")
const User = require("../models/user.model")

exports.followUser = (req, res, substring) => {

    var owner = req.user.username
    var nickname = substring[1]

    if (nickname) {
        if(owner == nickname) {
            return res.status(200).send({ error: "Opción invalida" })
        }else{
            Following.findOne({ username: owner, 'followings.username': nickname }, (err, followingUser) => {

                if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
                if (followingUser) return res.status(404).send({ error: "Ya sigues a este usuario" })
                if (!followingUser) {
    
                    Following.findOneAndUpdate({ username: owner }, { $push: { followings: { username: nickname } } }, { new: true }, (err, updateFollowing) => {
    
                        if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
                        if (!updateFollowing) return res.status(404).send({ error: "No se ha podido seguir al usuario" })
                        if (updateFollowing) {
            
                            User.findOneAndUpdate({ username: owner }, { $inc: { "no_following": 1 } }, { new: true }, (err, followingInc) => {
            
                                if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
                                if (!followingInc) return res.status(404).send({ error: "No se ha podido agregar el usuario a seguir" })
                                if (followingInc) {
            
                                    Follower.findOneAndUpdate({ username: nickname }, { $push: { followers: { username: owner } } }, { new: true }, (err, updateFollower) => {
            
                                        if (err) return res.status(500).send({ error: "No se pudo realizar esta petición " })
                                        if (!updateFollower) return res.status(404).send({ error: "No se ha podido agregar al seguidor" })
                                        if (updateFollower) {
                                            User.findOneAndUpdate({ username: nickname }, { $inc: { "no_followers": 1 } }, { new: true }, (err, followerInc) => {
            
                                                if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
                                                if (!followerInc) return res.status(404).send({ error: "No se ha podido aumentar los seguidores" })
                                                if (followerInc) return res.status(200).send({ usuarioSeguido: updateFollowing })
                                            })
                                        }
            
                                    })
            
                                }
            
                            })
                        }
            
                    })
    
                }
    
            })    
        }
    } else {
        return res.status(500).send({ error: "No has enviado los datos necesarios" })
    }

}

exports.unfollowUser = (req, res, substring) => {

    var owner = req.user.username
    var nickname = substring[1]

    if (nickname) {
        if(owner == nickname) {
            return res.status(200).send({ error: "Opción invalida" })
        }else{
            Following.findOne({ username: owner, 'followings.username': nickname }, (err, followingUser) => {

                if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
                if (!followingUser) return res.status(404).send({ error: "Ya no sigues a este usuario" })
                if (followingUser) {
    
                    Following.findOneAndUpdate({ username: owner }, { $pull: { followings: { username: nickname } } }, (err, updateFollowing) => {
    
                        if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
                        if (!updateFollowing) return res.status(404).send({ error: "No se ha podido seguir al usuario" })
                        if (updateFollowing) {
            
                            User.findOneAndUpdate({ username: owner }, { $inc: { "no_following": -1 } }, (err, followingInc) => {
            
                                if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
                                if (!followingInc) return res.status(404).send({ error: "No se ha podido agregar el usuario a seguir" })
                                if (followingInc) {
            
                                    Follower.findOneAndUpdate({ username: nickname }, { $pull: { followers: { username: owner } } }, (err, updateFollower) => {
            
                                        if (err) return res.status(500).send({ error: "No se pudo realizar esta petición " })
                                        if (!updateFollower) return res.status(404).send({ error: "No se ha podido agregar al seguidor" })
                                        if (updateFollower) {
                                            User.findOneAndUpdate({ username: nickname }, { $inc: { "no_followers": -1 } }, (err, followerInc) => {
            
                                                if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
                                                if (!followerInc) return res.status(404).send({ error: "No se ha podido aumentar los seguidores" })
                                                if (followerInc) return res.status(200).send({ usuarioSeguido: updateFollowing })
                                            })
                                        }
            
                                    })
            
                                }
            
                            })
                        }
            
                    })
    
                }
    
            })    
        }
    } else {
        return res.status(500).send({ error: "No has enviado los datos necesarios" })
    }

}