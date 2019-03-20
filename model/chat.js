const mongoose = require("mongoose");

const chatModel = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  name: {
    type: String,
    required: true
  },
  message: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
      },
      name: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      text: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model("chat", chatModel);
