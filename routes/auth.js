const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../model/user.model");

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);

    // Check if the email is already registered
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ _id: user._id }, config.jwtSecret);

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
