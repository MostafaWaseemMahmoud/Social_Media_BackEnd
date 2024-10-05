const express = require("express");
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt'); // Import bcrypt
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
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder where files will be uploaded on Cloudinary
    public_id: (req, file) => file.fieldname + '-' + Date.now(),
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/addUser', upload.single('file'), async (req, res) => {
  try {
    console.log("Request received:", req.body);
    const { name, email, password, profilePic } = req.body; 
    let profilePicUrl;

    // Check if a file is uploaded or a profilePic URL is provided
    if (req.file) {
      profilePicUrl = req.file.path; // Use uploaded file's URL
      console.log("File uploaded to Cloudinary:", profilePicUrl);
    } else if (profilePic) {
      profilePicUrl = profilePic; // Use URL from body
    } else {
      profilePicUrl = 'https://example.com/default-profile-pic.jpg'; // Default profile picture
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Create and save the user
    const user = new userSchema({
      name,
      email,
      password: hashedPassword,
      profilePic: profilePicUrl,
      Friends: [],
    });

    await user.save();
    console.log("User saved successfully");
    res.status(200).send(user);
  } catch (err) {
    console.error("Error while saving user:", err);
    res.status(500).send("Error while creating user. Please try again.");
  }
});

module.exports = router;
