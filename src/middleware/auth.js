const jwt = require('jsonwebtoken');

// Métodos HTTP que no modifican estado — no requieren verificación CSRF
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * verificarToken — Valida el JWT almacenado en la cookie HttpOnly.
 * Agrega req.usuario = { id, email, csrfToken } para uso posterior.
 */
const verificarToken = (req, res, next) => {
  try {
    const tokenJWT = req.cookies.jwt_token;

    if (!tokenJWT) {
      return res.status(401).json({ success: false, message: 'No autenticado', code: 'TOKEN_MISSING' });
    }

    const decoded = jwt.verify(tokenJWT, process.env.JWT_SECRET);

    if (decoded.apiKey !== process.env.API_KEY) {
      return res.status(401).json({ success: false, message: 'API Key inválida', code: 'APIKEY_INVALID' });
    }

    req.usuario = {
      id:        decoded.id,
      email:     decoded.email,
      csrfToken: decoded.csrfToken
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Sesión expirada', code: 'TOKEN_EXPIRED' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Token inválido', code: 'TOKEN_INVALID' });
    }
    console.error('Error en verificarToken:', error.message);
    return res.status(500).json({ success: false, message: 'Error en autenticación' });
  }
};

/**
 * verificarCSRF — Valida el header X-CSRF-Token en peticiones mutantes.
 * GET/HEAD/OPTIONS pasan sin comprobación (safe methods según RFC 7231).
 * Debe ejecutarse DESPUÉS de verificarToken (requiere req.usuario).
 */
const verificarCSRF = (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  const csrfHeader = req.headers['x-csrf-token'];

  if (!csrfHeader) {
    return res.status(403).json({ success: false, message: 'Token CSRF no proporcionado', code: 'CSRF_MISSING' });
  }

  if (!req.usuario || csrfHeader !== req.usuario.csrfToken) {
    return res.status(403).json({ success: false, message: 'Token CSRF inválido', code: 'CSRF_INVALID' });
  }

  next();
};

/**
 * validarApiKey — Protege el endpoint de login con una API key de servidor.
 */
const validarApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ success: false, message: 'API Key no proporcionada' });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ success: false, message: 'API Key inválida' });
  }

  next();
};

module.exports = { verificarToken, verificarCSRF, validarApiKey };
