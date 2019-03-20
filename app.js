const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userR = require("./route/api/user");
const postR = require("./route/api/post");
const chatR = require("./route/api/chat");
const profileR = require("./route/api/profile");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");

// local server database
const dbConnection = mongoose.connect(
  "mongodb://localhost:27017/course",
  { useNewUrlParser: true },
  (err, db) => {
    if (err) {
      console.log("fail to connect to the database");
    } else {
      console.log("database established");
    }
  }
);

//cloud database mongodb atlas

// const dbConnection = require("./config/key").url;
// mongoose
//   .connect(dbConnection, { useNewUrlParser: true })
//   .then(result => {
//     console.log("successfully connect");
//   })
//   .catch(err => {
//     console.log("fail to connect");
//     console.log(err);
//   });
app.use(morgan("dev"));
//body parser

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require("./config/passport")(passport);

app.use("/user", userR);
app.use("/profile", profileR);
app.use("/post", postR);
app.use("/chat", chatR);
module.exports = app;
