const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const post = require("../../model/post");
const profileM = require("../../model/profile");

const validationForPost = require("../../validation/post");

//post router for the post request

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const { errors, isvalid } = validationForPost(req.body);
    if (!isvalid) {
      return res.status(404).json(errors);
    }

    const postObject = new post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    postObject
      .save()
      .then(profile => {
        res.json(profile);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

//get all posts

router.get("/", (req, res, next) => {
  post
    .find()
    .sort({ date: -1 })
    .then(posts => {
      res.json({
        count: posts.length,
        response: posts
      });
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

//get post by id

router.get("/:post_id", (req, res, next) => {
  post
    .findById({ _id: req.params.post_id })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      res.status(404).json({ Message: "no post found with that id" });
    });
});

//delete the post

router.delete(
  "/:del_id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    profileM.findOne({ user: req.user.id }).then(profile => {
      post.findOne({ _id: req.params.del_id }).then(post => {
        if (post.user.toString() != req.user.id) {
          return res.status(401).json({ Message: "unauthorize user" });
        }

        post.remove().then(() => {
          res.json({
            message: "The post is deleted successfully",
            success: true
          });
        });
      });
    });
  }
);

// like post request by the id

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    profileM.findOne({ user: req.user.id }).then(profile => {
      post.findOne({ _id: req.params.id }).then(post => {
        if (
          post.like.filter(item => item.user.toString() == req.user.id).length >
          0
        ) {
          return res.status(401).json({ message: "user like already exist" });
        }
        post.like.unshift({ user: req.user.id });
        post
          .save()
          .then(like => {
            res.json({ like: "Like is successfully save", success: true });
          })
          .catch(err => res.status(404).json({ error: "unable to like" }));
      });
    });
  }
);

//unlike the  existing like post

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    profileM.findOne({ user: req.user.id }).then(profile => {
      post
        .findOne({ _id: req.params.id })
        .then(post => {
          if (
            post.like.filter(item => item.user.toString() == req.user.id)
              .length == 0
          ) {
            return res
              .status(404)
              .json({ Message: "user has not like the post" });
          }

          const unlikePost = post.like
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          post.like.splice(unlikePost, 1);

          post
            .save()
            .then(post => {
              res.json(post);
            })
            .catch(err => {
              res.status(404).json(err);
            });
        })
        .catch(err => {
          res.status(404).json(err);
        });
    });
  }
);

//comment post

router.post(
  "/comment/:com_id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    post.findOne({ _id: req.params.com_id }).then(post => {
      const comments = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      };
      post.comment.unshift(comments);
      post
        .save()
        .then(post => {
          res.json(post);
        })
        .catch(err => {
          res.status(404).json(err);
        });
    });
  }
);

//comment delete api

router.delete(
  "/comment/:id/:com_id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    post.findOne({ _id: req.params.id }).then(post => {
      console.log(post);
      if (
        post.comment.filter(
          comment => comment._id.toString() == req.params.com_id
        ).length == 0
      ) {
        return res.status(404).json("the comment not exist");
      }
      const removeIndes = post.comment
        .map(item => item._id.toString())
        .indexOf(req.params.com_id);

      post.comment.splice(removeIndes, 1);
      post
        .save()
        .then(result => {
          res.json(result);
        })
        .catch(err => {
          res.status(404).json("Fail to delete");
        });
    });
  }
);
module.exports = router;
