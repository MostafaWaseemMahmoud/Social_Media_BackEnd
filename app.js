const express = require('express');
const usersettings = require("./routers/userProfile");
const friendsettings = require("./routers/friends");
const posts = require("./routers/posts");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use("/usersettings" , usersettings)
app.use("/friendsettings" , friendsettings)
app.use("/posts" , posts);
app.get("/" ,  (req,res)=> {
    res.send("Server Is Connected !!!")
})

mongoose.connect("mongodb+srv://mostafawaseem22:deYV2xQGuSdqyJVy@e.ezjaj.mongodb.net/?retryWrites=true&w=majority&appName=e").then(()=> {
    console.log("DataBase Connected Successfully");
    app.listen(PORT, () => {
        console.log('Server started on http://localhost:3000');
      });
}).catch((e)=> {
    console.log("Can't Connect To Database With This Error: " + e)
})

