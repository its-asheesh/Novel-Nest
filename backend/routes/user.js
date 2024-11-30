const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth"); 
require("dotenv").config();

// Sign Up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    if (!username || !email || !password || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (username.length < 4) {
      return res.status(400).json({ message: "Username must be at least 4 characters long." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    if (password.length <= 5) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashPass,
      address,
    });
    await newUser.save();

    return res.status(201).json({ message: "Sign Up Successful" });
  } catch (error) {
    console.error("Error during sign-up:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Sign In
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (isMatch) {
      const authClaims = { name: existingUser.username, role: existingUser.role || "user" };
      const token = jwt.sign({ authClaims }, process.env.JWT_SECRET, { expiresIn: "30d" });
      return res.status(200).json({ id: existingUser._id, role: authClaims.role, token });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during sign-in:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get User Information
router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    if (!id) {
      return res.status(400).json({ message: "ID is required in headers." });
    }
    const data = await User.findById(id).select("-password");
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching user information:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user address
router.put("/update-address", authenticateToken, async (req, res) => {
  const { id } = req.headers;
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ message: "Address is required." });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.address = address;
    await user.save();

    res.status(200).json({ message: "Address updated successfully." });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
