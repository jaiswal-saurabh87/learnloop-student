require('dotenv').config(); // Make sure this is at the top

const express = require('express');
const http = require('http');
// ... other imports

const app = express();
// ...

// Database Connection
const db = mysql.createConnection(process.env.postgresql://learnloop_db_p9nr_user:CPK6BoVZJpN8nAYoGR6AsUkdaVAwnhZ1@dpg-d1h73jngi27c73ccc1ig-a/learnloop_db_p9nr); // Use the DATABASE_URL from Render

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Successfully connected to the database.');
});

// ... your routes and middleware

const PORT = process.env.PORT || 5000; // Render provides the PORT variable
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
