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

// Set up Cloudinary storage for Multer
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

// Upload post
router.post('/addpost/:userId', upload.single('file'), async (req, res) => {
    try {
        const { userId } = req.params;
        if (!req.file) return res.status(400).send("No file uploaded.");

        const mediaUrl = req.file.path;
        const { postTitle, postDescription } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).send("User not found.");

        console.log(user); // Debug: log user object

        const post = {
            mediaUrl: mediaUrl,
            postTitle: postTitle,
            postDescription: postDescription,
            likes: [],
            comments: []
        };

        // Ensure posts is defined
        user.posts = user.posts || []; 
        user.posts.push(post);
        await user.save();

        res.status(200).send("Post added successfully.");
    } catch (err) {
        console.error(err);
        res.status(500).send("We have an error: " + err.message);
    }
});

// Comment on a post
router.post("/commentpost/:postId", async (req, res) => {
    const { postId } = req.params;
    const { commentuserId, commentDescription, postuserId } = req.body;

    try {
        if (!commentuserId || !commentDescription || !postuserId) {
            return res.status(400).send("Missing required fields.");
        }

        const postuser = await User.findById(postuserId);
        if (!postuser) return res.status(404).send("User not found.");

        const post = postuser.posts.find(post => post._id.toString() === postId);
        if (!post) return res.status(404).send("Post not found.");

        const comment = {
            commentuserId: commentuserId,
            commentDescription: commentDescription
        };

        post.comments.push(comment);
        await postuser.save();

        res.status(200).send("Comment added successfully.");
    } catch (err) {
        console.error(err);
        res.status(500).send("We have an error: " + err.message);
    }
});

// Like a post
router.post("/likepost/:postId", async (req, res) => {
    const { postId } = req.params;
    const { commentuserId, postuserId } = req.body;

    try {
        if (!commentuserId || !postuserId) {
            return res.status(400).send("Missing required fields.");
        }

        const postuser = await User.findById(postuserId);
        if (!postuser) return res.status(404).send("User not found.");

        const post = postuser.posts.find(post => post._id.toString() === postId);
        if (!post) return res.status(404).send("Post not found.");

        if (!post.likes.includes(commentuserId)) {
            post.likes.push(commentuserId);
            await postuser.save();
            res.status(200).send("Like added successfully.");
        } else {
            res.status(400).send("You have already liked this post.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("We have an error: " + err.message);
    }
});

module.exports = router;
