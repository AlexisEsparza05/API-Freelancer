const express = require('express');
const router = express.Router();
const db = require('../db');  // Asegúrate de que esta línea apunte a tu módulo de conexión a la base de datos

// Ruta PUT para actualizar un freelancer
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Nombre, Email, Telefono, Especialidad } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE Freelancers SET Nombre = ?, Email = ?, Telefono = ?, Especialidad = ? WHERE FreelancerID = ?',
            [Nombre, Email, Telefono, Especialidad, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Freelancer no encontrado' });
        }

        res.json({
            message: 'Freelancer actualizado con éxito',
            FreelancerID: id,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta DELETE para eliminar un freelancer
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM Freelancers WHERE FreelancerID = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Freelancer no encontrado' });
        }

        res.json({
            message: 'Freelancer eliminado con éxito',
            FreelancerID: id,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta POST para crear un nuevo freelancer
router.post('/', async (req, res) => {
    const { Nombre, Email, Telefono, Especialidad } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO Freelancers (Nombre, Email, Telefono, Especialidad) VALUES (?, ?, ?, ?)',
            [Nombre, Email, Telefono, Especialidad]
        );

        res.status(201).json({
            message: 'Freelancer creado con éxito',
            FreelancerID: result.insertId,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta GET para obtener un freelancer específico por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query('SELECT * FROM Freelancers WHERE FreelancerID = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Freelancer no encontrado' });
        }

        res.json(rows[0]);  // Devolver el primer resultado encontrado
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta GET con paginación y búsqueda para freelancers
router.get('/', async (req, res) => {
    const { page = 1, limit = 100, search = '' } = req.query;
    const offset = (page - 1) * limit;

    try {
        const [rows] = await db.query(
            `SELECT * FROM Freelancers 
             WHERE Nombre LIKE ? OR Email LIKE ? OR Especialidad LIKE ? 
             LIMIT ? OFFSET ?`,
            [`%${search}%`, `%${search}%`, `%${search}%`, parseInt(limit), parseInt(offset)]
        );

        const [[{ total }]] = await db.query(
            `SELECT COUNT(*) as total FROM Freelancers 
             WHERE Nombre LIKE ? OR Email LIKE ? OR Especialidad LIKE ?`,
            [`%${search}%`, `%${search}%`, `%${search}%`]
        );

        res.json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            data: rows,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
