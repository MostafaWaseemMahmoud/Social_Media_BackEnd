const express = require('express');
const router = express.Router();
const http = require('http');
const socketIo = require('socket.io');

// Create an HTTP server (can also use app's server later if needed)
const server = http.createServer();
const io = socketIo(server);

// Handle Socket.IO connections and signaling
io.on('connection', (socket) => {
  console.log('New user connected');

  // Join a room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', socket.id);

    // Handle signaling data (for WebRTC)
    socket.on('signal', (data) => {
      io.to(data.to).emit('signal', data);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', socket.id);
    });
  });
});

// Route to test the video call service (optional)
router.get('/', (req, res) => {
  res.send('Video call service is running');
});

// You can listen to a specific port or use the existing server in app.js
server.listen(5001, () => {
  console.log('Video call signaling server running on port 5001');
});

module.exports = router;
