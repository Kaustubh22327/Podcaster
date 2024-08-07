const router = require("express").Router();
const user = require("./../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  console.log("hii from befire the register try block");

  try {
    console.log("hii from register try block");
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }
    if (username.length < 5) {
      return res
        .status(400)
        .json({ message: "username must have 5 cahracters" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must have 6 cahracters" });
    }
    console.log("hii from register try block level 2");

    //check user exists or not by checking email/username in database
    const existingemail = await user.findOne({ email: email });
    const existingusername = await user.findOne({ username: username });
    if (existingemail || existingusername) {
      return res
        .status(400)
        .json({ message: "username or email already exists " });
    }
    console.log("hii from register try block level 3");

    //agar abhi tak koi error nahi aaya to password ko hash kardo
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    console.log("hii from register try block level 4");

    //new user create karenge
    const newUser = new user({ username, email, password: hashedPass });
    await newUser.save();
    return res.status(200).json({ message: "account created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});

//login in fucntionality

router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "all fields are required to sign in" });
    }
    //check user exists or not by checking email/username in database
    const existingUser = await user.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "The enterned email does not exist" });
    }

    //if email is found check for password matching
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Entered password does not match , please try again",
      });
    }

    //generate jwt token
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("podcasterUserToken", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 100,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      id,
      username: existingUser.username,
      email: existingUser.email,
      message: "logged in successfully",
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

//logout
router.post("logout", async (req, res) => {
  res.clearCookie("podcasterUserToken", {
    httpOnly: true,
  });
  res.status(200).json({ message: "logged out successfully" });
});

//check cookie is presennt or not
router.post("/check-cookie", async (req, res) => {
  const token = req.cookies.podcasterUserToken;
  if (token) {
    res.status(200).json({ message: "true" });
  }
  res.status(200).json({ message: "false" });
});
module.exports = router;
