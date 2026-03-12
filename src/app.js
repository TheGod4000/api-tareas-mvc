const express = require('express');
const tareaRoutes = require('./routes/tarea.routes');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/tareas', tareaRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Ruta no encontrada' }));

module.exports = app;