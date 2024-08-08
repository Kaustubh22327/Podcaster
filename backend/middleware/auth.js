const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const auth = async (req, res, next) => {
  const token = req.cookies.podcastUserToken;
  try {
    if (token) {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.id);

      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      req.user = user;
      next();
    }
  } catch (error) {
    console.log(error);
    res.staus(500).json({ message: "invalid token" });
  }
};
module.exports = auth;
