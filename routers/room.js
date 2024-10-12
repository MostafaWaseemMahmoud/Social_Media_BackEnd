const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Room = require("../models/room.model");
const User = require("../models/user.model");
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

router.post("/addroom", async (req, res) => {
    try {
        const { user1ID, user2ID } = req.body;
        const user1 = await User.findById(user1ID);
        const user2 = await User.findById(user2ID);
        if (!user1 || !user2) {
            return res.status(404).send("One of the users can't be found.");
        }
        
        const room = new Room({
            roomTitle: `${user1.name} & ${user2.name}`,
            roomUsers: [user1ID, user2ID],
            messages: [],
        });
        
        await room.save();
        res.status(200).send(room);
    } catch (error) {
        console.error("Error in adding room:", error);
        res.status(500).send(`Error in adding room: ${error.message}`);
    }
});

router.get("/getuserrooms/:userID", async (req, res) => {
    try {
        const { userID } = req.params;
        const user = await User.findById(userID);
        
        if (!user) {
            return res.status(404).send("User not found.");
        }
        
        const allRooms = await Room.find({});
        const userRooms = [];
        
        allRooms.forEach(room => {
            room.roomUsers.forEach(roomUserId => {
                if (roomUserId == userID) {
                    userRooms.push(room); // Collect matching rooms
                }
            });
        });
        
        if (userRooms.length === 0) {
            return res.status(404).send("No rooms found for this user.");
        }
        
        return res.status(200).send(userRooms); // Return all matched rooms
    } catch (error) {
        console.error("Error in fetching rooms:", error);
        res.status(500).send(`Error in fetching rooms: ${error.message}`);
    }
});


router.post("/addmessage/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, messageContent } = req.body;
        const room = await Room.findById(id);

        if (!room) {
            return res.status(404).send("This Room ID was not found.");
        }

        const message = {
            userId: userId,
            message: messageContent,
        };
        room.messages.push(message);
        await room.save();
        res.status(200).send(room.messages);
    } catch (error) {
        console.error("Error adding message:", error);
        res.status(500).send(`Error adding message to the room: ${error.message}`);
    }
});

module.exports = router;
