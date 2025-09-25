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
mongoose.connect("mongodb+srv://Mostafawaseem:mostafawaseem11.@mc1.byqx8tc.mongodb.net/?retryWrites=true&w=majority&appName=Mc1")
    .then(() => {
        console.log("Database Connected Successfully");

        // ✅ الكود اللي هيشيل الـ index القديم اللي بيعمل مشكلة
mongoose.connection.collection('users').getIndexes()
  .then(indexes => {
    const indexNames = Object.keys(indexes);
    if (indexNames.includes("posts.postDescription_1")) {
      return mongoose.connection.collection('users').dropIndex("posts.postDescription_1");
    } else {
      console.log("ℹ️ No bad index found on posts.postDescription");
    }
  })
  .then(() => {
    console.log("✅ Index posts.postDescription_1 dropped (if it existed).");
  })
  .catch(err => {
    console.error("❌ Failed to drop index:", err.message);
  });


        // ✅ شغل السيرفر بعد حذف الـ index
        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    })
    .catch((e) => {
        console.log("Can't Connect to Database: " + e);
    });


module.exports = app;
