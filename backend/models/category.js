const mongoose = require("mongoose");
const podcasts = new mongoose.Schema(
  {
    categoryName: {
      type: String, //url denge
      unique: true,
      required: true,
    },
    podcasts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "podcasts",
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("category", category);
