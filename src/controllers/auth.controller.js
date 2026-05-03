const jwt    = require('jsonwebtoken');
const crypto = require('crypto');

const cookieBase = () => ({
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   parseInt(process.env.COOKIE_MAX_AGE) || 3600000
});

/**
 * POST /api/auth/login
 * Requiere header x-api-key (validado por middleware validarApiKey).
 * Genera JWT (HttpOnly cookie) + CSRF token (cookie legible + body).
 */
const login = (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email.trim() === '') {
      return res.status(400).json({ success: false, message: 'El email es requerido' });
    }

    const csrfToken = crypto.randomBytes(32).toString('hex');

    const payload = {
      id:        1,
      email:     email.trim(),
      apiKey:    process.env.API_KEY,
      csrfToken
    };

    const tokenJWT = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });

    const opts = cookieBase();

    // JWT: HttpOnly — inaccesible para JS del cliente
    res.cookie('jwt_token',  tokenJWT,  { ...opts, httpOnly: true });
    // CSRF: no HttpOnly — el SPA lo lee para restaurar sesión tras recarga
    res.cookie('csrf_token', csrfToken, opts);

    res.json({
      success:   true,
      csrfToken,
      usuario: { id: payload.id, email: payload.email }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, message: 'Error en el proceso de login' });
  }
};

/**
 * POST /api/auth/logout
 * Elimina ambas cookies del cliente.
 */
const logout = (req, res) => {
  try {
    const clearOpts = { secure: process.env.NODE_ENV === 'production', sameSite: 'strict' };
    res.clearCookie('jwt_token',  { ...clearOpts, httpOnly: true });
    res.clearCookie('csrf_token', clearOpts);
    res.json({ success: true, message: 'Logout exitoso' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ success: false, message: 'Error en el proceso de logout' });
  }
};

/**
 * GET /api/auth/verify
 * Devuelve datos del usuario y csrfToken para restaurar sesión tras recarga.
 * El JWT ya fue validado por verificarToken.
 */
const verificarAuth = (req, res) => {
  res.json({
    success:   true,
    usuario:   { id: req.usuario.id, email: req.usuario.email },
    csrfToken: req.usuario.csrfToken
  });
};

module.exports = { login, logout, verificarAuth };
