const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const validatorProfileInput = require("../../validation/profile");
const validationforExperience = require("../../validation/experience");
const validationforEducation = require("../../validation/education");

//load profile model
const profileM = require("../../model/profile");

//load user model

//get all profile user

router.get("/all", (req, res) => {
  profileM
    .find()
    .then(result => {
      res.status(200).json({
        count: result.length,
        profile: result
      });
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

//get api
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const errors = {};
    profileM
      .findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])

      .then(profile => {
        if (!profile) {
          errors.noPtofile = "There is no profile for such  user";
          res.status(404).json({
            error: errors
          });
        } else {
          res.status(200).json(profile);
        }
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

//get route for the handle profile

router.get("/handle/:handle", (req, res) => {
  const myHandle = req.params.handle;
  const errors = {};
  profileM
    .findOne({ handle: myHandle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.nohandle = "There is no profile for such user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      errors.operational = "operational error";
      res.status(404).json({
        error: {
          Message: errors,
          error: err
        }
      });
    });
});

//get route for the user profile by user_id

router.get("/user/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  const errors = {};
  profileM
    .findOne({ user: user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.nohandle = "There is no profile for such user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      errors.operational = "operational error";
      res.status(404).json({
        error: {
          Message: errors,
          error: err
        }
      });
    });
});

//post api

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const { errors, isvalid } = validatorProfileInput(req.body);
    console.log(isvalid);
    if (!isvalid) {
      return res.status(404).json(errors);
    }

    const profileField = {};
    profileField.user = req.user._id;
    console.log("user post profile");
    console.log(profileField.user);

    if (req.body.handle) profileField.handle = req.body.handle;
    if (req.body.company) profileField.company = req.body.company;
    if (req.body.website) profileField.website = req.body.website;
    if (req.body.location) profileField.location = req.body.location;
    if (req.body.status) profileField.status = req.body.status;
    if (req.body.bio) profileField.bio = req.body.bio;

    if (typeof req.body.skills != "undefined") {
      profileField.skills = req.body.skills.split(",");
    }
    profileField.social = {};

    if (req.body.youtube) profileField.social.youtube = req.body.youtube;
    if (req.body.facebook) profileField.social.facebook = req.body.facebook;
    if (req.body.instagram) profileField.social.instagram = req.body.instagram;
    if (req.body.twitter) profileField.social.twitter = req.body.twitter;
    if (req.body.linkdin) profileField.social.linkdin = req.body.linkdin;

    profileM
      .findOne({ user: req.user.id })
      .populate("user", ["avatar", "email"])
      .then(profile => {
        if (profile) {
          //update profile

          profileM
            .findOneAndUpdate(
              { user: req.user.id },
              { $set: profileField },
              { new: true }
            )
            .then(result => {
              res.status(200).json(result);
            });
        } else {
          //create profile
          //check weather the profile is exist or not
          profileM.findOne({ handle: profileField.handle }).then(profile => {
            if (profile) {
              res.status(404).json({
                error: "the profile already exist"
              });
            }

            const myProfile = new profileM(profileField);
            myProfile
              .save()

              .then(profile => {
                res.status(200).json(profile);
              })
              .catch(error => {
                res.status(400).json(error);
              });
          });
        }
      })
      .catch(err => {
        res.status(200).json(err);
      });
  }
);

//Add experience post request

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const { errors, isvalid } = validationforExperience(req.body);

    if (!isvalid) {
      return res.status(404).json(errors);
    }
    profileM.findOne({ user: req.user.id }).then(profile => {
      const expArray = {
        title: req.body.title,
        company: req.body.company,
        loaction: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      profile.experience.unshift(expArray);
      profile
        .save()
        .then(profile => {
          res.json(profile);
        })
        .catch(err => {
          res.status.json(err);
        });
    });
  }
);

//Add eudcation post request

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const { errors, isvalid } = validationforEducation(req.body);

    if (!isvalid) {
      return res.status(404).json(errors);
    }
    profileM.findOne({ user: req.user.id }).then(profile => {
      const educaArray = {
        school: req.body.school,
        degree: req.body.degree,
        field: req.body.field,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      profile.education.unshift(educaArray);
      profile
        .save()
        .then(profile => {
          res.json(profile);
        })
        .catch(err => {
          res.status.json(err);
        });
    });
  }
);

router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    profileM.findOne({ user: req.user.id }).then(profile => {
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
      profile.experience.splice(removeIndex, 1);

      //save in db
      profile
        .save()
        .then(profile => {
          res.json(profile);
        })
        .catch(err => {
          res.status(404).json(err);
        });
    });
  }
);

//education delete
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    profileM.findOne({ user: req.user.id }).then(profile => {
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);
      profile.education.splice(removeIndex, 1);

      //save in db
      profile
        .save()
        .then(profile => {
          res.json(profile);
        })
        .catch(err => {
          res.status(404).json(err);
        });
    });
  }
);

//delete the entire user

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    profileM
      .findOneAndRemove({ user: req.user.id })
      .then(profile => {
        res.json({
          message: "The profile is successfully delete"
        });
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
);
module.exports = router;
