const express = require('express');
const userSchema = require('../models/user.model');
require('dotenv').config(); // Use environment variables for security
const router = express.Router();

router.post("/addfriend", async (req, res) => {
    const { userId, FriendId } = req.body;

    try {
        // Fetch user and friend by their IDs
        const User = await userSchema.findById(userId);
        const friendUser = await userSchema.findById(FriendId);

        if (!User) {
            return res.status(404).send("Can't Find This User");
        }

        if (!friendUser) {
            return res.status(404).send("Can't Find This Friend User");
        }

        // Check if the friend is already in the user's friend list
        if (User.friends.includes(friendUser._id)) {
            return res.status(400).send("This Friend Already Exists");
        }

        // Add each other as friends
        User.friends.push(friendUser._id);
        friendUser.friends.push(User._id);

        // Save changes
        await User.save();
        await friendUser.save();

        res.status(200).send("Friend Added Successfully");
    } catch (error) {
        res.status(500).send("Error adding friend HAHAHAHAHAHHA");
    }
});

module.exports = router;
