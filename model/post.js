const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  like: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  comment: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      text: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = post = mongoose.model("post", postSchema);
