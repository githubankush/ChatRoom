import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ user, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "18h",
    });

    // Send cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Return success response
    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
      message: "Login successful.",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const profile = async (req,res) => {
  try{
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
    
  }
  catch(err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export const logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Optionally, you can also clear the user session or token from your database if needed

    res.status(200).json({ message: "Logout successful." });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
}


export const searchUsers = async (req, res) => {
  try {
    const searchQuery = req.query.search;

    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } }
      ]
    }).select("-password"); // exclude password from results

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error searching users", error });
  }
};



export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { username, email } = req.body;
    if (username) user.username = username;
    if (email) user.email = email;

    if (req.file) {
      const uploadsDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

      // Delete old avatar
      if (user.avatar && user.avatar.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, "..", user.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const ext = path.extname(req.file.originalname);
      const filename = `${userId}_${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, req.file.buffer);

      user.avatar = `/uploads/${filename}`;
    }

    await user.save();

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Profile update failed", error: err.message });
  }
};