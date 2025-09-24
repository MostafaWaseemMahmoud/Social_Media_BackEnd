const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const User = require('../models/user.model');
const cors = require("cors");
require('dotenv').config();
const router = express.Router();
router.use(cors());

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Generate random post ID
const generateRandomId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// Upload a new post
router.post('/addpost/:userId', multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'uploads',
            resource_type: 'auto',
            public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
        },
    })
}).single('file'), async (req, res) => {
    try {
        const { userId } = req.params;

        const mediaUrl = req.file?.path;
        const { postTitle, postDescription } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).send("User not found.");

        const post = {
            id: generateRandomId(),
            mediaUrl,
            postTitle,
            postDescription,
            likes: [],
            comments: [],
            dateCreated: new Date()
        };

        console.log(post);
        if(!post.id){
           res.status(500).send("Error While Generating An Id Fo this Post ")
            return console.log("No Generated Id");
        }
        user.posts = user.posts || [];
        user.posts.push(post);
        await user.save();

        res.status(200).send("Post added successfully.");
    } catch (err) {
        console.error(err);
        res.status(500).send("We have an error: " + err.message);
    }
});

// Helper function: Get post index from user
function getPostIndexFromUser(postsArr, postId) {
    return postsArr.findIndex(post => post.id === postId);
}

// Add a comment to a post
router.post("/commentpost", async (req, res) => {
    const { postId, userPostId, commentDescription, userid } = req.body;

    console.log("📦 Received in backend:", req.body);

    try {
        if (!postId || !userPostId || !commentDescription || !userid) {
            return res.status(400).send("Missing required fields.");
        }

        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(400).send("Invalid user ID format.");
        }

        const userPost = await User.findById(userPostId);
        if (!userPost) {
            return res.status(404).send("User not found.");
        }

        const postIndex = getPostIndexFromUser(userPost.posts, postId);
        if (postIndex === -1) {
            return res.status(404).send("Post not found.");
        }

        const post = userPost.posts[postIndex];
        post.comments = post.comments || [];
        post.comments.push({
            commentDescription: commentDescription,
            commentuserId: new mongoose.Types.ObjectId(userid)
        });

        userPost.posts[postIndex] = post;
        await userPost.save();

        return res.status(200).json({
            message: "Comment added successfully",
            comment: {
                commentDescription,
                commentuserId: userid
            }
        });

    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({
            error: "Error adding comment",
            details: error.message
        });
    }
});

// Get comments
router.get("/getcomments/:userId/:postId", async (req, res) => {
    const { userId, postId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found.");
        }

        const post = user.posts.find(p => p._id === postId);
        if (!post) {
            return res.status(404).send("Post not found.");
        }

        return res.status(200).json(post.comments);
    } catch (error) {
        console.error("Error retrieving comments:", error);
        res.status(500).send("Error retrieving comments.");
    }
});

// Like a post
router.post("/likepost/:userlikeid/:userId/:postId", async (req, res) => {
    const { userlikeid, userId, postId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found.");
        }

        const postIndex = getPostIndexFromUser(user.posts, postId);
        if (postIndex === -1) {
            return res.status(404).send("Post not found.");
        }

        const post = user.posts[postIndex];

        const alreadyLiked = post.likes.some(like => like.likeuserId === userlikeid);
        if (alreadyLiked) {
            return res.status(409).send("You had Already Liked This Post");
        }

        post.likes.push({ likeuserId: userlikeid });

        user.posts[postIndex] = post;
        await user.save();

        res.status(200).send(`Post liked successfully. Total likes: ${post.likes.length}`);
    } catch (error) {
        console.error("Error adding like:", error);
        res.status(500).send("Error adding like.");
    }
});

module.exports = router;
