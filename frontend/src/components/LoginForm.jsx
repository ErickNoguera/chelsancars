import { useState } from 'react';
import logo from '../assets/logo.png';
import { login } from '../services/api';
import '../styles/LoginForm.css';

export default function LoginForm({ onLoginExitoso, onVolver }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!usuario.trim() || !contrasena.trim()) {
      setError('Ingresa tu usuario y contraseña.');
      return;
    }

    setCargando(true);
    try {
      const respuesta = await login(usuario.trim(), contrasena);
      const { token } = respuesta.data;
      localStorage.setItem('token', token);
      onLoginExitoso(token);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Usuario o contraseña incorrectos.');
      } else {
        setError('Error al conectar con el servidor. Intenta de nuevo.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-pantalla">
      <div className="login-card">
        <div className="login-header">
          <img src={logo} alt="Chelsan Cars" className="login-logo" />
          <h1>Chelsan Cars</h1>
          <p>Panel de Inspección</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingresa tu usuario"
              autoComplete="username"
              disabled={cargando}
            />
          </div>

          <div className="login-field">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              disabled={cargando}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <button className="login-volver" onClick={onVolver}>
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}
