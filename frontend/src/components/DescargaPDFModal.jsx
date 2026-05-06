import { useState } from 'react';
import { buscarInspeccionPublica } from '../services/api';
import { generarPDF } from '../utils/generarPDF';
import '../styles/DescargaPDFModal.css';

export default function DescargaPDFModal({ onCerrar }) {
  const [nombreCliente, setNombreCliente] = useState('');
  const [patente, setPatente] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleDescargar = async (e) => {
    e.preventDefault();
    setError('');

    const nombreNormalizado = nombreCliente.trim();
    const patenteNormalizada = patente.trim().toUpperCase();

    if (!nombreNormalizado || !patenteNormalizada) {
      setError('Ingresa tu nombre y la patente del vehículo.');
      return;
    }

    setCargando(true);
    try {
      const respuesta = await buscarInspeccionPublica(nombreNormalizado, patenteNormalizada);
      const inspeccion = respuesta.data.inspeccion;

      if (!inspeccion) {
        setError('No se encontró ningún informe con ese nombre y patente.');
        return;
      }

      const datos = inspeccion.data_json || inspeccion;
      generarPDF(datos);
      setExito(true);
      setTimeout(() => onCerrar(), 2500);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No se encontró ningún informe con ese nombre y patente.');
      } else if (!err.response) {
        setError('No se puede conectar al servidor. Verificá que el backend esté iniciado.');
      } else {
        setError(`Error del servidor (${err.response.status}): ${err.response.data?.error || 'Intenta de nuevo.'}`);
      }
    } finally {
      setCargando(false);
    }
  };

  const handleFondoClick = (e) => {
    if (e.target === e.currentTarget) onCerrar();
  };

  return (
    <div className="modal-fondo" onClick={handleFondoClick}>
      <div className="modal-card">
        <button className="modal-cerrar" onClick={onCerrar} aria-label="Cerrar">
          ✕
        </button>

        {exito ? (
          <div className="modal-exito">
            <div className="modal-exito-icono">✓</div>
            <h2 className="modal-titulo">¡PDF descargado!</h2>
            <p className="modal-descripcion">Tu informe se descargó correctamente.</p>
          </div>
        ) : (
          <>
            <h2 className="modal-titulo">Descargar Informe</h2>
            <p className="modal-descripcion">
              Ingresa tu nombre y la patente del vehículo para obtener tu informe en PDF.
            </p>

            <form onSubmit={handleDescargar} className="modal-form">
              <div className="modal-field">
                <label htmlFor="nombreCliente">Tu nombre</label>
                <input
                  id="nombreCliente"
                  type="text"
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  disabled={cargando}
                  autoFocus
                />
              </div>

              <div className="modal-field">
                <label htmlFor="patente">Patente del vehículo</label>
                <input
                  id="patente"
                  type="text"
                  value={patente}
                  onChange={(e) => setPatente(e.target.value)}
                  placeholder="Ej: ABC123"
                  disabled={cargando}
                />
              </div>

              {error && <p className="modal-error">{error}</p>}

              <button type="submit" className="modal-btn" disabled={cargando}>
                {cargando ? 'Buscando...' : 'Descargar PDF'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
