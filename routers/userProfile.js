const express = require("express"); // Make sure express is correctly imported
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const userSchema = require('../models/user.model');
const bcrypt = require('bcrypt'); // For password hashing
require('dotenv').config(); // For environment variables

const router = express.Router(); // Define the router correctly

// Configure Cloudinary with environment variables
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

// Upload route using Cloudinary storage
router.post('/addUser', upload.single('file'), async (req, res) => {
  try {
    console.log(req.file); // Check if file is being received
    
    const { name, email, password } = req.body;
    const profilePic = req.file ? req.file.path : null; // Avoid error if req.file is undefined

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userSchema({
      name,
      email,
      password: hashedPassword,
      profilePic,
      Friends: [],
    });

    await user.save();
    res.status(200).send(user);
  } catch (err) {
    console.error("Error while saving user:", err);
    res.status(500).send("Internal server error");
  }
});


// Route to get all users
router.get("/allusers", async (req, res) => {
  try {
    const allUsers = await userSchema.find({}); // Fetch all users
    res.status(200).send(allUsers);
  } catch (err) {
    console.error("Error while fetching users:", err); // Log the actual error
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
