const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    console.log("Login request");
    res.json({ token: req.user });
  }
);

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "Hello, authenticated user !" });
  }
);

router.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "Logged out successfully" });
  }
);

router.post(
  "/refresh",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const userId = req.user.userId;
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: "1hr",
    });
    res.json({ token });
  }
);

module.exports = router;
