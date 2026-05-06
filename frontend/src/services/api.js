import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
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

// Renueva el access token automáticamente cuando expira
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/admin/refresh`, { refreshToken });
          localStorage.setItem('token', data.token);
          original.headers.Authorization = `Bearer ${data.token}`;
          return api(original);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.reload();
        }
      }
    }
    return Promise.reject(error);
  }
);

// --- Autenticación ---
export const login = (username, password) =>
  api.post('/admin/login', { username, password });

export const logoutApi = (refreshToken) =>
  api.post('/admin/logout', { refreshToken });

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
export const buscarInspeccionPublica = (nombreCliente, patente) =>
  api.get('/api/inspections/publico', { params: { client: nombreCliente, plate: patente } });

// --- IA (requiere JWT) ---
export const improveText = (text) =>
  api.post('/api/ai/improve-text', { text }).then((res) => res.data.data);
