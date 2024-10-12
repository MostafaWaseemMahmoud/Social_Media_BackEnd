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
router.post('/addpost/:userId', upload.single('file'), (req, res, next) => {
  res.setTimeout(60000, () => { // Set timeout of 1 minute
    return res.status(408).send("Request timed out. Try again.");
  });
  next();
}, async (req, res) => {
  try {
    const { userId } = req.params;

    // Log that request has been received
    console.log("Received request to upload file for user:", userId);

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // Log the uploaded file details
    console.log("File uploaded to Cloudinary:", req.file.path);

    const mediaUrl = req.file.path; // Image/Video URL from Cloudinary
    const { postTitle, postDescription } = req.body;

    // Find user by ID
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).send("Can't Find Any User With This Id");
    }

    // Create new post object
    const post = {
      mediaUrl: mediaUrl, // Supports both images and videos
      postTitle: postTitle,
      postDescription: postDescription,
    };

    // Log that the post is being added to the user
    console.log("Adding post for user:", userId);

    // Add the post to the user's posts array
    user.Posts.push(post);

    // Save updated user
    await user.save();

    // Log successful save and respond
    console.log("Post saved successfully for user:", userId);

    res.status(200).send("Post Added Successfully");
  } catch (err) {
    console.error("Error occurred during upload:", err.message);
    res.status(500).send("We have an error: " + err.message);
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
    const { commentuserId, commentDescription, postuserId } = req.body;
  
    try {
      // Validate input
  
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

      post.likes++
      // Save updated user with the new comment
      await postuser.save();
  
      res.status(200).send("Like added successfully.");
    } catch (err) {
      console.error("Error occurred during commenting:", err.message);
      res.status(500).send("We have an error: " + err.message);
    }
  });

module.exports = router;
