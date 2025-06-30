const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-super-secret-key'; // Use the same secret key

// @route   POST api/auth/register
// @desc    Register a user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const db = req.app.get('db');

    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        db.query('INSERT INTO users SET ?', { username, email, password: hashedPassword }, (err, result) => {
            if (err) throw err;
            const payload = { user: { id: result.insertId } };
            jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
        });
    });
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = req.app.get('db');

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    });
});

module.exports = router;