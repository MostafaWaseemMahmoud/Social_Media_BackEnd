const express = require('express');
const usersettings = require("./routers/userProfile");
const friendsettings = require("./routers/friends");
const posts = require("./routers/posts");
const room = require("./routers/room");
const videoCallRouter = require("./routers/livestreaming");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Use all your routers
app.use("/usersettings", usersettings);
app.use("/friendsettings", friendsettings);
app.use("/posts", posts);
app.use("/rooms", room);
app.use("/api/video-call", videoCallRouter);

app.get("/", (req, res) => {
    res.send("Server Is Connected !!!");
});


// MongoDB connection and starting the main server
mongoose.connect("mongodb+srv://mostafawaseem22:deYV2xQGuSdqyJVy@e.ezjaj.mongodb.net/?retryWrites=true&w=majority&appName=e")
    .then(() => {
        console.log("Database Connected Successfully");
        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    })
    .catch((e) => {
        console.log("Can't Connect to Database: " + e);
    });

module.exports = app;
