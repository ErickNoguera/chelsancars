import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

// Adjunta el token JWT automáticamente a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Autenticación ---
export const login = (username, password) =>
  api.post('/admin/login', { username, password });

// --- Inspecciones (requieren JWT) ---
export const crearInspeccion = (datos) =>
  api.post('/api/inspections', datos);

export const listarInspecciones = (pagina = 1, limite = 20) =>
  api.get('/api/inspections', { params: { pagina, limite } });

export const obtenerInspeccion = (id) =>
  api.get(`/api/inspections/${id}`);

export const actualizarInspeccion = (id, datos) =>
  api.put(`/api/inspections/${id}`, datos);

export const eliminarInspeccion = (id) =>
  api.delete(`/api/inspections/${id}`);

// --- Búsqueda pública (sin JWT, para clientes) ---
// Requiere nombre del cliente y patente del vehículo
export const buscarInspeccionPublica = (nombreCliente, patente) =>
  api.get('/api/inspections/publico', { params: { client: nombreCliente, plate: patente } });
