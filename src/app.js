require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const tareaRoutes = require('./routes/tarea.routes');
const authRoutes  = require('./routes/auth.routes');
const { verificarToken, verificarCSRF } = require('./middleware/auth');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas — JWT + CSRF en mutaciones
app.use('/api/tareas', verificarToken, verificarCSRF, tareaRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Ruta no encontrada' }));

module.exports = app;