// server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Create an express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the front-end files (e.g., HTML, CSS, JS)
app.use(express.static('public')); // Assuming your front-end is in 'public' folder

// WebSocket connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for drawing events from clients
    socket.on('drawing', (data) => {
        // Broadcast the drawing data to all other connected clients
        socket.broadcast.emit('drawing', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
