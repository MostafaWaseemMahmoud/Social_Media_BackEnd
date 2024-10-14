const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const usersettings = require("./routers/userProfile");
const friendsettings = require("./routers/friends");
const posts = require("./routers/posts");
const room = require("./routers/room");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173/", // Adjust as necessary
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', socket.id);

    socket.on('signal', (data) => {
      io.to(data.to).emit('signal', data);
    });

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', socket.id);
      console.log('Client disconnected:', socket.id);
    });
  });
});


// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Define routes
app.use("/usersettings", usersettings);
app.use("/friendsettings", friendsettings);
app.use("/posts", posts);
app.use("/rooms", room);

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', socket.id);

    socket.on('signal', (data) => {
      io.to(data.to).emit('signal', data);
    });

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', socket.id);
      console.log('Client disconnected:', socket.id);
    });
  });
});

// Basic route
app.get("/", (req, res) => {
  res.send("Server Is Connected !!!");
});

// MongoDB connection
mongoose.connect("mongodb+srv://mostafawaseem22:deYV2xQGuSdqyJVy@e.ezjaj.mongodb.net/?retryWrites=true&w=majority&appName=e")
  .then(() => {
    console.log("Database Connected Successfully");
    server.listen(process.env.PORT || 3000, () => {
      console.log('Server started on http://localhost:3000');
    });
  })
  .catch((e) => {
    console.log("Can't Connect To Database With This Error: " + e);
  });

module.exports = { app, server }; // Export both app and server if needed
