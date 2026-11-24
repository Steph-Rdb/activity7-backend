
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all records
router.get('/', async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM records ORDER BY id ASC'
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// GET one record
router.get('/:id', async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM records WHERE id = $1',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// CREATE a record
router.post('/', async (req, res, next) => {
    try {
        const { title, category, description, status } = req.body;

        if (!title || !category) {
            return res.status(400).json({
                error: 'Title and category are required'
            });
        }

        const result = await pool.query(
            `INSERT INTO records (title, category, description, status)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, category, description || '', status || 'Pending']
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// UPDATE a record
router.put('/:id', async (req, res, next) => {
    try {
        const { title, category, description, status } = req.body;

        const result = await pool.query(
            `UPDATE records
             SET title = COALESCE($1, title),
                 category = COALESCE($2, category),
                 description = COALESCE($3, description),
                 status = COALESCE($4, status)
             WHERE id = $5 RETURNING *`,
            [title, category, description, status, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// DELETE a record
router.delete('/:id', async (req, res, next) => {
    try {
        const result = await pool.query(
            'DELETE FROM records WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json({ message: 'Record deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
