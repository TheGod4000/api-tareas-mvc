const express = require('express');
const { login, logout, verificarAuth } = require('../controllers/auth.controller');
const { validarApiKey, verificarToken, verificarCSRF } = require('../middleware/auth');

const router = express.Router();

/** POST /api/auth/login — público, requiere x-api-key header */
router.post('/login',  validarApiKey, login);

/** POST /api/auth/logout — privado, requiere JWT + CSRF (modifica estado) */
router.post('/logout', verificarToken, verificarCSRF, logout);

/** GET /api/auth/verify — privado, sólo JWT (GET es safe, sin CSRF) */
router.get('/verify',  verificarToken, verificarAuth);

module.exports = router;
