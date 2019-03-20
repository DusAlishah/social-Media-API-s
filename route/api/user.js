const express = require("express");
const router = express.Router();
const UserS = require("../../model/User");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const keyDetails = require("../../config/key");
const passport = require("passport");
const validateRegistorInput = require("../../validation/registration");

router.get("/", (req, res, next) => {
  res.status(200).json({
    mesag: "get user request"
  });
});

router.post("/register", (req, res, next) => {
  const { errors, isvalid } = validateRegistorInput(req.body);

  console.log(isvalid);
  console.log(errors);
  if (!isvalid) {
    return res.status(400).json(errors);
  }
  UserS.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        res.status(400).json({
          mesage: "Email already exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(404).json({
              message: "password invalid"
            });
          } else {
            const avatar = gravatar.url(req.body.email, {
              s: "200",
              r: "pg",
              d: "mm"
            });
            const myUser = new UserS({
              name: req.body.name,
              email: req.body.email,
              password: hash,
              avatar
            });
            myUser
              .save()

              .then(result => {
                console.log(result);
                res.status(200).json({
                  Message: "Successfully save the user",
                  Data: result
                });
              })
              .catch(err => {
                console.log(err);
                res.status(404).json({
                  message: {
                    error: "Fail to save the user data"
                  }
                });
              });
          }
        });
      }
    })
    .catch(err => {
      res.status(404).json({
        message: "operational Error"
      });
    });
});

router.post("/login", (req, res, next) => {
  UserS.findOne({ email: req.body.email })
    .then(result => {
      if (!result) {
        res.status(404).json({
          message: "user is not exist"
        });
      } else {
        bcrypt
          .compare(req.body.password, result.password)
          .then(isMatch => {
            if (isMatch) {
              //create payload
              console.log(result._id);
              const payload = {
                name: result.name,
                avatar: result.avatar,
                email: result.email,
                id: result._id
              };
              //creating the jason web token
              jwt.sign(
                payload,
                keyDetails.secretKey,
                { expiresIn: "1h" },
                (err, token) => {
                  if (err) {
                    res.status(200).json({
                      succes: false,
                      message: "fail to create the token"
                    });
                  } else {
                    res.status(200).json({
                      succes: true,
                      token: "Bearer " + token
                    });
                  }
                }
              );
            } else {
              res.status(400).json({
                message: "user not exist"
              });
            }
          })
          .catch(err => {
            res.status(400).json({ message: "opertion failed", error: err });
          });
      }
    })
    .catch(err => {});
});

router.get(
  "/change",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avater: req.user.avatar
    });
  }
);

module.exports = router;
