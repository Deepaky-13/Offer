import dotenv from "dotenv";
dotenv.config();

import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = "1d";

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  console.log("JWT_SECRET:", JWT_SECRET);
  const token = jwt.sign(
    { id: user._id, role: user.role, permissions: user.permissions },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax", // or "none" if using HTTPS
    secure: false, // true if HTTPS
  });
  res.json({ user, token }); // no need to send token in body
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

// Create user (admin only)
export const createUser = async (req, res) => {
  const { name, email, password, role, permissions } = req.body;

  // Optional: check if admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const user = await User.create({ name, email, password, role, permissions });
  res.status(201).json({ message: "User created", user });
};

// Get all users (admin only)
export const getUsers = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const users = await User.find();
  res.json(users);
};

export const updateUser = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Unauthorized" });

  const { id } = req.params;
  const { name, email, role, permissions } = req.body;
  console.log(permissions);

  // Ensure permissions is always an array
  const updatedData = {
    name,
    email,
    role,
    permissions: Array.isArray(permissions) ? permissions : [],
  };

  const user = await User.findByIdAndUpdate(id, updatedData, { new: true });

  res.json({ message: "User updated", user });
};

export const getCurrentUser = (req, res) => {
  console.log(req.user);

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Send back user info
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      permissions: req.user.permissions, // Array of allowed menu keys
    },
  });
};
