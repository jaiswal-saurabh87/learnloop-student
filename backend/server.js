// At the very top of server.js
require('dotenv').config();

// ... other imports

// Update the database connection object
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mysql = require('mysql');

// App Initialization
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity in local dev
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('MySQL Connected...');
});

// Make DB accessible to routes
app.set('db', db);

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));


// Real-time Socket.io connections
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Placeholder for whiteboard sync
    socket.on('whiteboard draw', (data) => {
        socket.broadcast.emit('whiteboard draw', data);
    });

    // Placeholder for chat
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
