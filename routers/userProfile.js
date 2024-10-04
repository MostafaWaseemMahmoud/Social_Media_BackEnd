const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const userSchema = require('../models/user.model');
require('dotenv').config(); // Use environment variables for security
const router = express.Router();

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

// Upload route using Cloudinary storage
router.post('/addUser', upload.single('file'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const profilePic = req.file.path; // Get Cloudinary file path
    
    const user = new userSchema({
      name: name,
      email: email,
      password: password,
      profilePic: profilePic,
      Friends: [],
    });
    
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("We have an error: " + err);
}
});

router.get("/allusers", async (req, res) => {
    try {
      const allUsers = await userSchema.find({});
      res.status(200).send(allUsers);
    } catch (err) {
      res.status(500).send("We have an error: " + err);
    }
});

module.exports = router;
