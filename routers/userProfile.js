const express = require("express");
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const userSchema = require('../models/user.model');
require('dotenv').config();
const cors = require("cors")
app.use(cors())
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

// Route to add a new user
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

    // Check if a user with the same name or email already exists
    const existingUser = await userSchema.findOne({
      $or: [{ name }, { email }]
    });

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return res.status(200).send(existingUser); // Return existing user
    }

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

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await userSchema.find(); // Retrieve all users from the database
    res.status(200).json(users); // Return the users as JSON
  } catch (err) {
    console.error("Error while fetching users:", err);
    res.status(500).send("Error while fetching users. Please try again.");
  }
});

// Route to get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.id); // Fetch user by ID
    if (!user) {
      return res.status(404).send("User not found."); // Handle case where user does not exist
    }
    res.status(200).json(user); // Return the user as JSON
  } catch (err) {
    console.error("Error while fetching user:", err);
    res.status(500).send("Error while fetching user. Please try again.");
  }
});

module.exports = router;
