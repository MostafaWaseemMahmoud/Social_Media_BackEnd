const express = require('express');
const router = express.Router();
const { Server } = require('socket.io');

const io = new Server(5001, {
    cors: {
        origin: '*', // Allow requests from any origin
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join room', (roomId) => {
        socket.join(roomId);
        console.log(`Client joined room: ${roomId}`);
    });

    // Handle other events here

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

module.exports = router;
