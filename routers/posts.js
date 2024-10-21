const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const User = require('../models/user.model');
const cors = require("cors");
require('dotenv').config();
const router = express.Router();
router.use(cors());

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to generate a random alphanumeric ID
const generateRandomId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// Add a post
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
        if (!req.file) return res.status(400).send("No file uploaded.");

        const mediaUrl = req.file.path;
        const { postTitle, postDescription } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).send("User not found.");

        const post = {
            _id: generateRandomId(),
            mediaUrl,
            postTitle,
            postDescription,
            likes: 0,
            comments: []
        };

        user.posts = user.posts || [];
        user.posts.push(post);
        await user.save();

        res.status(200).send("Post added successfully.");
    } catch (err) {
        console.error(err);
        res.status(500).send("We have an error: " + err.message);
    }
});


function getPostFromUser(postsArr,postId) {
    for (let i = 0; i < postsArr.length; i++) {
        const post = postsArr[i];
        if(post._id == postId) {
            return post;
        }else {
            console.log("0--0--0")
        }
    }
}

// Add a comment to a post
router.post("/commentpost", async (req, res) => {
    const { postId, userPostId, commentDescription } = req.body;
    try {
        if (!postId) {
            return res.status(404).send("Post ID not found.");
        } else if (!userPostId) {
            return res.status(404).send("User ID not found.");
        } else if (!commentDescription) {
            return res.status(404).send("Comment description not found.");
        }

        const userPost = await User.findById(userPostId);
        if (!userPost) {
            return res.status(404).send("User not found.");
        }

        const post = getPostFromUser(userPost.posts, postId);
        if (!post) {
            return res.status(404).send("Post not found.");
        }

        post.comments.push(commentDescription);
        await userPost.save();

        return res.status(200).send(`Comment added: ${commentDescription} to This user `);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).send("Error adding comment.", error);
    }
});

router.get("/getcomments/:userId/:postId", async (req, res) => {
    const { userId, postId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found.");
        }

        const post = getPostFromUser(user.posts, postId);
        if (!post) {
            return res.status(404).send("Post not found.");
        }

        return res.status(200).json(post.comments);
    } catch (error) {
        console.error("Error retrieving comments:", error);
        res.status(500).send("Error retrieving comments.");
    }
});

router.post("/likepost/:userId/:postId", async (req, res) => {
    const { userId, postId } = req.params;

    try {
        // Find the user who owns the post
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Find the post to like
        const post = getPostFromUser(user.posts, postId);
        if (!post) {
            return res.status(404).send("Post not found.");
        }

        // Increment the like count by 1
        post.likes += 1;

        // Save the user document
        await user.save();

        res.status(200).send(`Post liked successfully. Total likes: ${post.likes}`);
    } catch (error) {
        console.error("Error adding like:", error);
        res.status(500).send("Error adding like.");
    }
});

module.exports = router;
