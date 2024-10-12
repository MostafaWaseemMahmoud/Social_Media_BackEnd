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

// Set up Cloudinary storage for Multer (for both images and videos)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Folder where files will be uploaded on Cloudinary
        resource_type: 'auto', // Automatically detects whether the file is an image or video
        public_id: (req, file) => file.fieldname + '-' + Date.now(),
    },
});

// Multer setup with file size limit (100 MB)
const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100 MB file size limit
});

// Upload route using Cloudinary storage for both images and videos
router.post('/addpost/:userId', upload.single('file'), async (req, res) => {
    res.setTimeout(60000, () => {
        return res.status(408).json({ status: 'error', message: "Request timed out. Try again." });
    });

    try {
        const { userId } = req.params;

        if (!req.file) {
            return sendResponse(res, 400, "No file uploaded.");
        }

        const mediaUrl = req.file.path;
        const { postTitle, postDescription } = req.body;

        const user = await userSchema.findById(userId);
        if (!user) {
            return sendResponse(res, 404, "Can't Find Any User With This Id");
        }

        const post = {
            mediaUrl,
            postTitle,
            postDescription,
            likes: [],
            comments: []
        };

        user.posts.push(post);
        await user.save();

        sendResponse(res, 200, "Post Added Successfully");
    } catch (err) {
        next(err); // Pass the error to the error handler
    }
});


// Comment on a post
router.post("/commentpost/:postId", async (req, res) => {
    const { postId } = req.params;
    const { commentuserId, commentDescription, postuserId } = req.body;

    try {
        // Validate input
        if (!commentuserId || !commentDescription || !postuserId) {
            return res.status(400).send("Missing required fields.");
        }

        const postuser = await userSchema.findById(postuserId);
        if (!postuser) {
            return res.status(404).send("No User With This ID");
        }

        // Find the post
        const post = postuser.posts.find(post => post._id.toString() === postId);
        if (!post) {
            return res.status(404).send("No post found with this ID");
        }

        // Create a new comment
        const comment = {
            commentuserId: commentuserId,
            commentDescription: commentDescription
        };

        // Add comment to the post
        post.comments = post.comments || []; // Ensure comments array exists
        post.comments.push(comment);

        // Save updated user with the new comment
        await postuser.save();

        res.status(200).send("Comment added successfully.");
    } catch (err) {
        console.error("Error occurred during commenting:", err.message);
        res.status(500).send("We have an error: " + err.message);
    }
});

// Like on a post
router.post("/likepost/:postId", async (req, res) => {
    const { postId } = req.params;
    const { commentuserId, postuserId } = req.body;

    try {
        // Validate input
        if (!commentuserId || !postuserId) {
            return res.status(400).send("Missing required fields.");
        }

        const postuser = await userSchema.findById(postuserId);
        if (!postuser) {
            return res.status(404).send("No User With This ID");
        }

        // Find the post
        const post = postuser.posts.find(post => post._id.toString() === postId);
        if (!post) {
            return res.status(404).send("No post found with this ID");
        }

        // Initialize likes array if it doesn't exist
        post.likes = post.likes || [];
        // Check if the user has already liked the post
        if (!post.likes.includes(commentuserId)) {
            post.likes.push(commentuserId);
        } else {
            return res.status(400).send("You have already liked this post.");
        }

        // Save updated user with the new like
        await postuser.save();

        res.status(200).send("Like added successfully.");
    } catch (err) {
        console.error("Error occurred during liking post:", err.message);
        res.status(500).send("We have an error: " + err.message);
    }
});

module.exports = router;
