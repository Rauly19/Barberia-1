import React, { useState } from 'react';
import type { Barbero, Cita } from '../App';

interface PanelAdminProps {
  listaCitas: Cita[];
  listaBarberos: Barbero[];
  alCancelarCita: (idCita: number) => void;
  alRegistrarBarbero: (barbero: Barbero) => void;
  alEliminarBarbero: (idBarbero: number) => void;
}

export const PanelAdmin: React.FC<PanelAdminProps> = ({ 
  listaCitas, 
  listaBarberos, 
  alCancelarCita, 
  alRegistrarBarbero,
  alEliminarBarbero 
}) => {
  const [estaAutenticado, setEstaAutenticado] = useState<boolean>(false);
  const [contrasenaIngresada, setContrasenaIngresada] = useState<string>('');

  // Estados para el autorregistro de un barbero
  const [nombreBarbero, setNombreBarbero] = useState<string>('');
  const [especialidadBarbero, setEspecialidadBarbero] = useState<string>('');

  const manejarLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (contrasenaIngresada === 'admin123') {
      setEstaAutenticado(true);
      setContrasenaIngresada('');
    } else {
      alert('Contraseña incorrecta. Intenta con "admin123".');
    }
  };

  const manejarRegistroBarbero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreBarbero.trim() || !especialidadBarbero.trim()) {
      alert('Por favor completa todos los campos del barbero.');
      return;
    }

    const nuevoBarbero: Barbero = {
      id: Date.now(),
      nombre: nombreBarbero,
      especialidad: especialidadBarbero
    };

    alRegistrarBarbero(nuevoBarbero);
    setNombreBarbero('');
    setEspecialidadBarbero('');
    alert('¡Te has registrado como barbero con éxito!');
  };

  if (!estaAutenticado) {
    return (
      <div>
        <div className="encabezado-portal">
          <h1>Acceso Administrativo</h1>
          <p>Introduce la contraseña para gestionar el sistema (ej. admin123)</p>
        </div>

        <form onSubmit={manejarLogin}>
          <div className="grupo-formulario">
            <label>Contraseña de Acceso</label>
            <input 
              type="password" 
              value={contrasenaIngresada}
              onChange={(e) => setContrasenaIngresada(e.target.value)}
              placeholder="Contraseña"
            />
          </div>
          <button type="submit" className="boton-reservar">
            Entrar al Panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="encabezado-portal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', textAlign: 'left' }}>
        <div>
          <h1>Panel de Control</h1>
          <p>Gestión interna del negocio</p>
        </div>
        <button 
          onClick={() => setEstaAutenticado(false)}
          className="boton-secundario"
          style={{ margin: 0 }}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Formulario para que nuevos barberos se registren por su cuenta */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '18px', borderRadius: '14px', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.05rem', marginBottom: '12px', color: '#1e293b' }}>✂️ Registro de Nuevos Barberos</h2>
        <form onSubmit={manejarRegistroBarbero}>
          <div className="grupo-formulario" style={{ marginBottom: '12px' }}>
            <label>Nombre Completo</label>
            <input 
              type="text" 
              value={nombreBarbero}
              onChange={(e) => setNombreBarbero(e.target.value)}
              placeholder="Ej. Roberto Gómez"
            />
          </div>
          <div className="grupo-formulario" style={{ marginBottom: '12px' }}>
            <label>Especialidad</label>
            <input 
              type="text" 
              value={especialidadBarbero}
              onChange={(e) => setEspecialidadBarbero(e.target.value)}
              placeholder="Ej. Fade moderno, Barbas, Estilo clásico"
            />
          </div>
          <button type="submit" className="boton-reservar" style={{ marginTop: '4px' }}>
            Registrarme como Barbero
          </button>
        </form>
      </div>

      {/* Listado de Barberos Activos */}
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.05rem', marginBottom: '10px', color: '#1e293b' }}>👨‍🦰 Barberos Activos ({listaBarberos.length})</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {listaBarberos.map(b => (
            <span key={b.id} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✂️ <strong>{b.nombre}</strong> ({b.especialidad})
              {listaBarberos.length > 1 && (
                <button 
                  onClick={() => alEliminarBarbero(b.id)} 
                  style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold' }}
                  title="Eliminar barbero"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Listado de Citas Agendadas */}
      <h2 style={{ fontSize: '1.05rem', marginBottom: '12px', color: '#1e293b' }}>
        📅 Citas Agendadas ({listaCitas.length})
      </h2>

      {listaCitas.length === 0 ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No hay citas agendadas por el momento.</p>
      ) : (
        <ul className="lista-citas">
          {listaCitas.map((cita) => {
            const barberoAsignado = listaBarberos.find(b => b.id === cita.barberoId);
            return (
              <li key={cita.id} className="item-cita">
                <div className="info-cita">
                  <h3>{cita.nombreCliente} - <span style={{ color: '#2563eb' }}>{cita.servicio}</span></h3>
                  <p>👨‍🦰 Barbero: <strong>{barberoAsignado ? barberoAsignado.nombre : 'General'}</strong></p>
                  <p>📅 {cita.fecha} | ⏰ {cita.hora} | 📞 {cita.telefonoCliente}</p>
                </div>
                <button 
                  className="boton-cancelar"
                  onClick={() => alCancelarCita(cita.id)}
                >
                  Cancelar Cita
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};