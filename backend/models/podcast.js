const mongoose = require("mongoose");
const podcasts = new mongoose.Schema(
  {
    frontImage: {
      type: String, //url denge
      unique: true,
      required: true,
    },
    audioFile: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      unqiue: true,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user", //kis user ne banaya hai
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category", //kis user ne banaya hai
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("podcast", podcast);
