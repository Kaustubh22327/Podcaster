// const router = require("express").Router();
const user = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
// Register route
router.post("/register", async (req, res) => {
  console.log("Inside register route");

  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (username.length < 5) {
      return res
        .status(400)
        .json({ message: "Username must have 5 characters" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must have 6 characters" });
    }

    // Check if user already exists
    const existingEmail = await user.findOne({ email });
    const existingUsername = await user.findOne({ username });
    if (existingEmail || existingUsername) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new user({ username, email, password: hashedPass });
    await newUser.save();
    return res.status(200).json({ message: "Account created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login route
router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required to sign in" });
    }

    // Check if user exists
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "The entered email does not exist" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Entered password does not match, please try again" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("podcasterUserToken", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout route
router.post("/logout", async (req, res) => {
  res.clearCookie("podcasterUserToken", {
    httpOnly: true,
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// Check cookie route
router.post("/check-cookie", async (req, res) => {
  const token = req.cookies.podcasterUserToken;
  if (token) {
    return res.status(200).json({ message: "true" });
  }
  res.status(200).json({ message: "false" });
});

module.exports = router;
