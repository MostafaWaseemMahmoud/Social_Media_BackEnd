const express = require('express');
const usersettings = require("./routers/userProfile");
const friendsettings = require("./routers/friends");
const posts = require("./routers/posts");
const room = require("./routers/room");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use("/usersettings" , usersettings)
app.use("/friendsettings" , friendsettings)
app.use("/posts" , posts);
app.use("/rooms" , room);
app.get("/" ,  (req,res)=> {
    res.send("Server Is Connected !!!")
})


const cors = require('cors');

// Use CORS with options
const corsOptions = {
    origin: 'https://socialmedia-application1.netlify.app', // Allow your frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable cookies to be sent
    optionsSuccessStatus: 204 // For legacy browser support
};

app.use(cors(corsOptions));

mongoose.connect("mongodb+srv://mostafawaseem22:deYV2xQGuSdqyJVy@e.ezjaj.mongodb.net/?retryWrites=true&w=majority&appName=e").then(()=> {
    console.log("DataBase Connected Successfully");
    app.listen(PORT, () => {
        console.log('Server started on http://localhost:3000');
      });
}).catch((e)=> {
    console.log("Can't Connect To Database With This Error: " + e)
})

module.exports = app;
