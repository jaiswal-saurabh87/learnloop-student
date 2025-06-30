const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// --- To-Do List API ---

// @route   GET api/todos
// @desc    Get all user's todos
router.get('/todos', auth, (req, res) => {
    const db = req.app.get('db');
    db.query('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// @route   POST api/todos
// @desc    Add a new todo
router.post('/todos', auth, (req, res) => {
    const { task } = req.body;
    const db = req.app.get('db');
    const newTodo = { task, user_id: req.user.id };
    db.query('INSERT INTO todos SET ?', newTodo, (err, result) => {
        if (err) throw err;
        db.query('SELECT * FROM todos WHERE id = ?', [result.insertId], (err, finalResult) => {
            if (err) throw err;
            res.json(finalResult[0]);
        });
    });
});

// @route   PUT api/todos/:id
// @desc    Update a todo (mark as complete/incomplete)
router.put('/todos/:id', auth, (req, res) => {
    const { is_completed } = req.body;
    const db = req.app.get('db');
    db.query('UPDATE todos SET is_completed = ? WHERE id = ? AND user_id = ?', [is_completed, req.params.id, req.user.id], (err, result) => {
        if (err) throw err;
        res.json({ msg: 'Todo updated' });
    });
});

// @route   DELETE api/todos/:id
// @desc    Delete a todo
router.delete('/todos/:id', auth, (req, res) => {
    const db = req.app.get('db');
    db.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, result) => {
        if (err) throw err;
        res.json({ msg: 'Todo deleted' });
    });
});


module.exports = router;