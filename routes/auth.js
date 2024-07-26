const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Registrasi pengguna
router.post("/register", async (req, res) => {
  const { username, password, role, nim } = req.body;

  try {
    if (role === "student" && !nim) {
      return res.status(400).json({ message: "NIM is required for students" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
      nim: role === "student" ? nim : null,
    });

    // Exclude password from the response
    const { password: _, ...userWithoutPassword } = user.toJSON();

    // Exclude nim from the response if the role is 'staff'
    if (role === "staff") {
      delete userWithoutPassword.nim;
    }

    res
      .status(201)
      .json({ message: "Registration successful", user: userWithoutPassword });
  } catch (err) {
    console.error("Registration Error:", err);
    res
      .status(400)
      .json({ message: "Registration failed", error: err.message });
  }
});

// Login pengguna
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Username Not Found!" });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    // Exclude password from the response
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.json({ message: "Login successful", token, user: userWithoutPassword });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(400).json({ message: "Login failed", error: err.message });
  }
});

module.exports = router;
