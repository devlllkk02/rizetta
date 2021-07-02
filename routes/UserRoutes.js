const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, SENDGRID_API, EMAIL } = require("../config/keys");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = mongoose.model("User");
const Recipe = mongoose.model("Recipe");
const Auth = require("../middleware/Auth");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_API,
    },
  })
);

//ROUTE : POST : Protected
router.get("/protected", Auth, (req, res) => {
  res.send("Access Protected!");
});

//ROUTE : POST : Sign Up
router.post("/signup", (req, res) => {
  const { firstName, lastName, email, password, conpassword, image } = req.body;

  //Checking Empty Fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !conpassword ||
    !image
  ) {
    return res.status(422).json({ error: "Please enter all the fields!" });
  }

  //Checking the email format
  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  ) {
    return res.status(422).json({ error: "Invalid Email!" });
  }

  //Password Mismatch
  if (password != conpassword) {
    return res.status(422).json({ error: "Passwords Mismatch!" });
  }

  //Checking if the user Exists with the entered email
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User already exists with this email" });
      }
      //Hashing the password
      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            image: image,
          });

          //Saving the user in the database
          user
            .save()
            .then((user) => {
              transporter.sendMail({
                to: user.email,
                from: "rizetta.app@gmail.com",
                subject: "Welcome to Rizetta",
                html: `
                <div
        style="
          background-color: #e16120;
          color: #ffffff;
          height: 50px;
          width: 100%;
        "
      >
        <p
          style="
            margin: 0px;
            font-weight: bold;
            font-size: 36px;
            text-align: center;
          "
        >
          Rizetta
        </p>
      </div>

      <div style="background-color: #e16120">
        <p
          style="
            margin: 0px 0px 0px 0px;
            color: #ffffff;
            text-align: center;
            padding-bottom: 10px;
          "
        >
          Discover The Chef In You
        </p>
      </div>
      <div>
        <p
          style="
            text-align: center;
            font-size: 18px;
            color: #4b9b96;
            font-weight: bold;
          "
        >
          Welcome ${user.firstName} ${user.lastName} to Rizetta
        </p>
      </div>
      <div style="height: 110px">
        <p style="margin: 10px 0px; color: #4a4a4a; text-align: center">
          Rizetta is an app where we can share our recipes with people around
          the world. It is very similar to the other social media apps that we
          are using these days. In Rizetta people can search the recipe of their
          favorite food and lots of recipes will be displayed which are uploaded
          from different users. So they can choose the recipe that they like a
          lot. If they want to use it later, then they can save it too.
        </p>
      </div>
      <div
      style="
        background-color: #4b9b96;
        color: #ffffff;
        width: 100%;
        padding: 5px 0px;
      "
    >
      <p style="margin: 0px; text-align: center">
        Copyright 2021 Rizetta. All Rights Reserved
      </p>
    </div>
                
                `,
              });
              res.json({ message: "User saved successfully!" });
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});

//ROUTE : POST : Log In
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  //Checking Empty Fields
  if (!email || !password) {
    return res.status(422).json({ error: "Please enter all the fields!" });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res
          .status(422)
          .json({ error: "Please enter valid email or password!" });
      }

      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            res.json({
              message: "Successfully logged in!",
              token: token,
              user: savedUser,
            });
          } else {
            return res
              .status(422)
              .json({ error: "Please enter valid email or password!" });
          }
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});

//ROUTE : POST : Reset Password
router.post("/resetpassword", (req, res) => {
  const { email } = req.body;
  //Checking Empty Fields
    if (!email) {
    return res.status(422).json({ error: "Please enter all the fields!" });
  }
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      console.log(error);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "User doesn't exist with the entered Email!" });
      }

      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;

      user
        .save()
        .then((result) => {
          transporter.sendMail({
            to: user.email,
            from: "rizetta.app@gmail.com",
            subject: "Rizetta - Reset Your Password",
            html: `
            <div
        style="
          background-color: #e16120;
          color: #ffffff;
          height: 50px;
          width: 100%;
        "
      >
        <p
          style="
            margin: 0px;
            font-weight: bold;
            font-size: 36px;
            text-align: center;
          "
        >
          Rizetta
        </p>
      </div>

      <div style="background-color: #e16120">
        <p
          style="
            margin: 0px 0px 0px 0px;
            color: #ffffff;
            text-align: center;
            padding-bottom: 10px;
          "
        >
          Discover The Chef In You
        </p>
      </div>
      <p style="color: #4a4a4a;">You Requested for a Password Reset</p>
      <p style="color: #4a4a4a;">
        Click this <a href="${EMAIL}/newpassword/${token}">Link</a> to reset
        your Password
      </p>
      <div
      style="
        background-color: #4b9b96;
        color: #ffffff;
        width: 100%;
        padding: 5px 0px;
      "
    >
      <p style="margin: 0px; text-align: center">
        Copyright 2021 Rizetta. All Rights Reserved
      </p>
    </div>
          
          `,
          });
          res.json({ message: "Check your Email to reset your password!" });
        })
        .catch((error) => console.log(error));
    });
  });
});

//ROUTE : POST : New Password
router.post("/newpassword", (req, res) => {
  const { password, conpassword, token } = req.body;
  //Checking Empty Fields
  if (!password || !conpassword) {
    return res.status(422).json({ error: "Please enter all the fields!" });
  }
  //Password Mismatch
  if (password != conpassword) {
    return res.status(422).json({ error: "Passwords Mismatch!" });
  }

  User.findOne({ resetToken: token, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "Session expired.Please try again!" });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;

        user
          .save()
          .then((savedUser) => {
            res.json({
              message: "Password Updated Successfully!",
              user: savedUser,
            });
          })
          .catch((error) => console.log(error));
      });
    })
    .catch((error) => console.log(error));
});

//ROUTE : UPDATE : Delete User
router.put("/deleteuser", Auth, (req, res) => {
  //Checking Empty Fields
  if (!req.body.email) {
    return res.status(422).json({ error: "Please enter all the fields!" });
  }

  //Check User Validity
  User.findById(req.user._id)
    .then((user) => {
      if (user.email != req.body.email) {
        return res.json({ error: "Invalid Email" });
      }
    })
    .catch((error) => console.log(error));

  //Delete User Recipes
  Recipe.deleteMany({ postedBy: req.user._id }).exec((error, result) => {
    if (error) {
      return res.status(422).json({ error: error });
    }
  });

  //Delete User Related Attributes in other Recipes and Users

  Recipe.updateMany(
    {},
    {
      $pull: {
        hearts: req.user._id,
        bookmark: req.user._id,
        comments: { postedBy: req.user._id },
        ratings: { postedBy: req.user._id },
      },
    },
    { new: true }
  ).exec((error, result) => {
    if (error) {
      return res.status(422).json({ error: error });
    }
  });

  User.updateMany(
    {},
    {
      $pull: {
        followers: req.user._id,
        following: req.user._id,
      },
    },
    { new: true }
  ).exec((error, result) => {
    if (error) {
      return res.status(422).json({ error: error });
    }

    User.findById(req.user._id)
      .then((user) => {
        user
          .remove()
          .then((result) => {
            res.json({
              message: "User deleted successfully!",
              result: result,
            });
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));

  });
});

module.exports = router;
