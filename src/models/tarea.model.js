let tareas = [
  { id: 1, titulo: 'Aprender Express', completada: false },
  { id: 2, titulo: 'Implementar MVC', completada: false },
  { id: 3, titulo: 'Probar API con Postman', completada: true }
];

let idActual = 4;

const obtenerTodas = () => tareas;

const obtenerPorId = (id) => tareas.find(tarea => tarea.id === id);

// Actividad 3: Búsqueda por título (case insensitive)
const buscarPorTitulo = (query) => {
  const queryMinusculas = query.toLowerCase();
  return tareas.filter(tarea => tarea.titulo.toLowerCase().includes(queryMinusculas));
};

const crear = (datosTarea) => {
  const nuevaTarea = {
    id: idActual++,
    titulo: datosTarea.titulo,
    completada: datosTarea.completada || false
  };
  tareas.push(nuevaTarea);
  return nuevaTarea;
};

const actualizarCompleta = (id, datosTarea) => {
  const indice = tareas.findIndex(t => t.id === id);
  if (indice === -1) return null;
  tareas[indice] = { id, titulo: datosTarea.titulo, completada: datosTarea.completada || false };
  return tareas[indice];
};

const actualizarParcial = (id, datosParciales) => {
  const indice = tareas.findIndex(t => t.id === id);
  if (indice === -1) return null;
  tareas[indice] = { ...tareas[indice], ...datosParciales, id };
  return tareas[indice];
};

const eliminar = (id) => {
  const indice = tareas.findIndex(t => t.id === id);
  if (indice === -1) return null;
  return tareas.splice(indice, 1)[0];
};

module.exports = {
  obtenerTodas, obtenerPorId, buscarPorTitulo, crear, 
  actualizarCompleta, actualizarParcial, eliminar
};