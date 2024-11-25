const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate de que esta línea apunte a tu módulo de conexión a la base de datos

// Ruta PUT para actualizar una empresa
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Nombre, Direccion, Telefono, Email } = req.body;
  
    try {
      const [result] = await db.query(
        'UPDATE Empresas SET Nombre = ?, Direccion = ?, Telefono = ?, Email = ? WHERE EmpresaID = ?',
        [Nombre, Direccion, Telefono, Email, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Empresa no encontrada' });
      }
  
      res.json({
        message: 'Empresa actualizada con éxito',
        EmpresaID: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Ruta DELETE para eliminar una empresa
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await db.query(
        'DELETE FROM Empresas WHERE EmpresaID = ?',
        [id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Empresa no encontrada' });
      }
  
      res.json({
        message: 'Empresa eliminada con éxito',
        EmpresaID: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Ruta POST para crear una nueva empresa
router.post('/', async (req, res) => {
    const { Nombre, Direccion, Telefono, Email } = req.body;
  
    try {
      const [result] = await db.query(
        'INSERT INTO Empresas (Nombre, Direccion, Telefono, Email) VALUES (?, ?, ?, ?)',
        [Nombre, Direccion, Telefono, Email]
      );
  
      res.status(201).json({
        message: 'Empresa creada con éxito',
        EmpresaID: result.insertId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Ruta GET para obtener una empresa específica por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const [rows] = await db.query('SELECT * FROM Empresas WHERE EmpresaID = ?', [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Empresa no encontrada' });
      }
  
      res.json(rows[0]);  // Devolver el primer resultado encontrado
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
// Ruta GET con paginación y búsqueda
router.get('/', async (req, res) => {
  const { page = 1, limit = 100, search = '' } = req.query;
  const offset = (page - 1) * limit;

  try {
    console.log({
      query: `SELECT * FROM Empresas 
              WHERE Nombre LIKE ? OR Direccion LIKE ? OR Email LIKE ? 
              LIMIT ? OFFSET ?`,
      params: [`%${search}%`, `%${search}%`, `%${search}%`, parseInt(limit), parseInt(offset)],
    });

    const [rows] = await db.query(
      `SELECT * FROM Empresas 
       WHERE Nombre LIKE ? OR Direccion LIKE ? OR Email LIKE ? 
       LIMIT ? OFFSET ?`,
      [`%${search}%`, `%${search}%`, `%${search}%`, parseInt(limit), parseInt(offset)]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM Empresas 
       WHERE Nombre LIKE ? OR Direccion LIKE ? OR Email LIKE ?`,
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
