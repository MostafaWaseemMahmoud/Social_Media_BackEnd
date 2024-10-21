const express = require("express");
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const userSchema = require('../models/user.model');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads', 
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
});

const upload = multer({ storage });
const router = express.Router();

// Route to add a new user
router.post('/addUser', upload.single('file'), async (req, res) => {
  try {
    console.log("Request received:", req.body);
    const { name, email, password, profilePic } = req.body;

    const profilePicUrl = req.file ? req.file.path : profilePic || 'https://example.com/default-profile-pic.jpg';

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    const existingUser = await userSchema.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return res.status(200).send(existingUser);
    }

    const user = new userSchema({ name, email, password: hashedPassword, profilePic: profilePicUrl, friends: [] });
    await user.save();
    console.log("User saved successfully");
    res.status(200).send(user);
  } catch (err) {
    console.error("Error while saving user:", err);
    res.status(500).send("Error while creating user. Please try again.");
  }
});

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await userSchema.find();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error while fetching users:", err);
    res.status(500).send("Error while fetching users. Please try again.");
  }
});

// Route to get a user by ID
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userSchema.findById(id);
    res.status(200).json(user);
  } catch (err) {
    console.error("Error while fetching user:", err);
    res.status(500).send("Error while fetching user. Please try again.");
  }
});

module.exports = router;
