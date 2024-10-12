const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');

// Import routers
const usersettings = require("./routers/userProfile");
const friendsettings = require("./routers/friends");
const posts = require("./routers/posts");
const room = require("./routers/room");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
    origin: 'https://socialmedia-application1.netlify.app', // Allow your frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable cookies to be sent
    optionsSuccessStatus: 204 // For legacy browser support
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json()); // Built-in middleware for JSON parsing

// Route handlers
app.use("/usersettings", usersettings);
app.use("/friendsettings", friendsettings);
app.use("/posts", posts);
app.use("/rooms", room);

// Health Check Route
app.get("/", (req, res) => {
    res.send("Server Is Connected !!!");
});

// MongoDB Connection
mongoose.connect("mongodb+srv://mostafawaseem22:deYV2xQGuSdqyJVy@e.ezjaj.mongodb.net/?retryWrites=true&w=majority&appName=e", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Database Connected Successfully");
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
})
.catch((error) => {
    console.error("Can't Connect To Database With This Error: " + error);
});

module.exports = app;
