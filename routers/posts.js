const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const User = require('../models/user.model');
require('dotenv').config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer setup
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        resource_type: 'auto',
        public_id: (req, file) => file.fieldname + '-' + Date.now(),
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100 MB limit
});

// Add post route
router.post('/addpost/:userId', upload.single('file'), async (req, res) => {
    try {
        const { userId } = req.params;
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const mediaUrl = req.file.path;
        const { postTitle, postDescription } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found.");
        }

        const post = {
            mediaUrl: mediaUrl,
            postTitle: postTitle,
            postDescription: postDescription,
            likes: [],
            comments: []
        };

        user.posts.push(post);
        await user.save();

        res.status(200).send("Post Added Successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// Additional routes for comments and likes...

module.exports = router;
