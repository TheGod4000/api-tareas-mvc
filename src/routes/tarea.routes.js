const express = require('express');
const tareaController = require('../controllers/tarea.controller');
const router = express.Router();

router.get('/', tareaController.obtenerTodas);
router.get('/buscar', tareaController.buscar); // Actividad 3
router.get('/:id', tareaController.obtenerPorId);
router.post('/', tareaController.crear);
router.put('/:id', tareaController.actualizarCompleta);
router.patch('/:id', tareaController.actualizarParcial);
router.delete('/:id', tareaController.eliminar);

module.exports = router;