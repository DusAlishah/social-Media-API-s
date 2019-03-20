const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const chatM = require("../../model/chat");
const passport = require("passport");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const chats = {};
    chats.message = {};
    chats.user = req.user.id;
    if (req.body.name) chats.name = req.body.name;
    if (req.body.date) chats.name = req.body.date;

    chatM.findOne({ _id: req.user.id }).then(chat => {
      if (chat) {
        res.status(404).json({
          message: "user already exist"
        });
      }

      const myChat = new chatM({
        user: req.user.id,
        name: req.body.name,
        text: req.body.text,
        date: req.body.date
      });
      myChat
        .save()
        .then(result => {
          res.json(result);
        })
        .catch(err => err);
    });
  }
);

module.exports = router;
