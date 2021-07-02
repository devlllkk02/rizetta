const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Recipe = mongoose.model("Recipe");

const Auth = require("../middleware/Auth");

//ROUTE : GET : All Users
router.get("/allusers", Auth, (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((error) => console.log(error));
});

//ROUTE : GET : Visitor Profile (User & Recipes)
router.get("/visitor/:userId", Auth, (req, res) => {
  User.findOne({ _id: req.params.userId })
    .populate("followers")
    .populate("following")
    .then((user) => {
      //   res.send(user);
      Recipe.find({ postedBy: user._id })
        .populate("postedBy")
        .populate("ratings.postedBy", "_id")
        .then((recipes) => {
          res.send({ user: user, recipes: recipes });
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});

//ROUTE : GET : User Profile
router.get("/editprofile", Auth, (req, res) => {
  User.findOne({ _id: req.user._id })
    .populate("followers")
    .populate("following")
    .then((user) => res.send(user))
    .catch((error) => console.log(error));
});
//ROUTE : Update : User Profile
router.put("/updateprofile", Auth, (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  }).exec((error, result) => {
    if (error) {
      return res.status(422).json({ error: error });
    } else {
      res.send(result);
    }
  });
});

//ROUTE : UPDATE : Follow
router.put("/follow", Auth, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $addToSet: { followers: req.user._id } },
    { new: true }
  ).exec((error, visitor) => {
    if (error) {
      return res.status(422).json({ error: error });
    }
    User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { following: visitor._id } },
      { new: true }
    ).exec((error, user) => {
      if (error) {
        return res.status(422).json({ error: error });
      }
      res.send({ user: user, visitor: visitor });
    });
  });
});
//ROUTE : UPDATE : UnFollow
router.put("/unfollow", Auth, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $pull: { followers: req.user._id } },
    { new: true }
  ).exec((error, visitor) => {
    if (error) {
      return res.status(422).json({ error: error });
    }
    User.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: visitor._id } },
      { new: true }
    ).exec((error, user) => {
      if (error) {
        return res.status(422).json({ error: error });
      }
      res.send({ user: user, visitor: visitor });
    });
  });
});
//ROUTE : UPDATE : Remove Following
router.put("/removefollow", Auth, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $pull: { following: req.user._id } },
    { new: true }
  ).exec((error, visitor) => {
    if (error) {
      return res.status(422).json({ error: error });
    }
    User.findByIdAndUpdate(
      req.user._id,
      { $pull: { followers: visitor._id } },
      { new: true }
    ).exec((error, user) => {
      if (error) {
        return res.status(422).json({ error: error });
      }
      res.send({ user: user, visitor: visitor });
    });
  });
});
module.exports = router;
