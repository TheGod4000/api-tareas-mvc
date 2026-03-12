const tareaModel = require('../models/tarea.model');

// Incluye Actividad 4: Formato de respuesta
const obtenerTodas = (req, res) => {
  try {
    const tareas = tareaModel.obtenerTodas();
    const formato = req.query.formato;

    if (formato === 'text') {
      let texto = '--- LISTA DE TAREAS ---\n';
      tareas.forEach(t => {
        texto += `[${t.completada ? 'X' : ' '}] ID: ${t.id} - ${t.titulo}\n`;
      });
      return res.type('text/plain').send(texto);
    }

    res.json({ success: true, data: tareas, count: tareas.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// Incluye Actividad 3: Buscar por título
const buscar = (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Falta el parámetro ?q=' });
    }
    const resultados = tareaModel.buscarPorTitulo(query);
    res.json({ success: true, data: resultados, count: resultados.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

const obtenerPorId = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    
    const tarea = tareaModel.obtenerPorId(id);
    if (!tarea) return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    
    res.json({ success: true, data: tarea });
  } catch (error) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
};

const crear = (req, res) => {
  try {
    const { titulo, completada } = req.body;
    if (!titulo) return res.status(400).json({ success: false, message: 'Título es requerido' });
    
    const nuevaTarea = tareaModel.crear({ titulo, completada });
    res.status(201).json({ success: true, data: nuevaTarea });
  } catch (error) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
};

const actualizarCompleta = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { titulo, completada } = req.body;
    
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    if (!titulo) return res.status(400).json({ success: false, message: 'Título es requerido' });
    
    const actualizada = tareaModel.actualizarCompleta(id, { titulo, completada });
    if (!actualizada) return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    
    res.json({ success: true, data: actualizada });
  } catch (error) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
};

const actualizarParcial = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    if (Object.keys(req.body).length === 0) return res.status(400).json({ success: false, message: 'Enviar datos' });
    
    const actualizada = tareaModel.actualizarParcial(id, req.body);
    if (!actualizada) return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    
    res.json({ success: true, data: actualizada });
  } catch (error) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
};

const eliminar = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    
    const eliminada = tareaModel.eliminar(id);
    if (!eliminada) return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    
    res.json({ success: true, data: eliminada });
  } catch (error) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
};

module.exports = { obtenerTodas, buscar, obtenerPorId, crear, actualizarCompleta, actualizarParcial, eliminar };