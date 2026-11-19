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
  // Pestaña de acceso: 'admin' o 'barbero'
  const [tipoAcceso, setTipoAcceso] = useState<'admin' | 'barbero'>('admin');

  // Sesión de administrador
  const [adminAutenticado, setAdminAutenticado] = useState<boolean>(false);
  const [contrasenaAdmin, setContrasenaAdmin] = useState<string>('');

  // Sesión de barbero
  const [barberoAutenticado, setBarberoAutenticado] = useState<Barbero | null>(null);
  const [usuarioBarberoLogin, setUsuarioBarberoLogin] = useState<string>('');
  const [contrasenaBarberoLogin, setContrasenaBarberoLogin] = useState<string>('');

  // Formulario del administrador para registrar un barbero
  const [nombreBarbero, setNombreBarbero] = useState<string>('');
  const [especialidadBarbero, setEspecialidadBarbero] = useState<string>('');
  const [usuarioBarberoNuevo, setUsuarioBarberoNuevo] = useState<string>('');
  const [contrasenaBarberoNueva, setContrasenaBarberoNueva] = useState<string>('');

  const manejarLoginAdmin = (evento: React.FormEvent) => {
    evento.preventDefault();
    if (contrasenaAdmin === 'admin123') {
      setAdminAutenticado(true);
      setContrasenaAdmin('');
    } else {
      alert('Contraseña de administrador incorrecta. Usa "admin123".');
    }
  };

  const manejarLoginBarbero = (evento: React.FormEvent) => {
    evento.preventDefault();
    const barberoEncontrado = listaBarberos.find(
      (b) =>
        b.usuario.trim().toLowerCase() === usuarioBarberoLogin.trim().toLowerCase() &&
        b.contrasena === contrasenaBarberoLogin
    );

    if (barberoEncontrado) {
      setBarberoAutenticado(barberoEncontrado);
      setUsuarioBarberoLogin('');
      setContrasenaBarberoLogin('');
    } else {
      alert('Usuario o contraseña de barbero incorrectos.');
    }
  };

  const manejarRegistrarBarbero = (evento: React.FormEvent) => {
    evento.preventDefault();

    if (
      !nombreBarbero.trim() ||
      !especialidadBarbero.trim() ||
      !usuarioBarberoNuevo.trim() ||
      !contrasenaBarberoNueva.trim()
    ) {
      alert('Completa nombre, especialidad, usuario y contraseña del barbero.');
      return;
    }

    const usuarioRepetido = listaBarberos.some(
      (b) => b.usuario.toLowerCase() === usuarioBarberoNuevo.trim().toLowerCase()
    );
    if (usuarioRepetido) {
      alert('Ese nombre de usuario ya está en uso. Elige otro.');
      return;
    }

    const nuevoBarbero: Barbero = {
      id: Date.now(),
      nombre: nombreBarbero.trim(),
      especialidad: especialidadBarbero.trim(),
      usuario: usuarioBarberoNuevo.trim(),
      contrasena: contrasenaBarberoNueva
    };

    alRegistrarBarbero(nuevoBarbero);
    setNombreBarbero('');
    setEspecialidadBarbero('');
    setUsuarioBarberoNuevo('');
    setContrasenaBarberoNueva('');
    alert(`Barbero "${nuevoBarbero.nombre}" registrado con usuario "${nuevoBarbero.usuario}".`);
  };

  // VISTA CUANDO EL BARBERO YA INICIÓ SESIÓN
  if (barberoAutenticado) {
    const citasDelBarbero = listaCitas.filter((cita) => cita.barberoId === barberoAutenticado.id);

    return (
      <div>
        <div
          className="encabezado-portal"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'left'
          }}
        >
          <div>
            <h1>Hola, {barberoAutenticado.nombre}</h1>
            <p>Especialidad: {barberoAutenticado.especialidad}</p>
          </div>
          <button
            className="boton-secundario"
            onClick={() => setBarberoAutenticado(null)}
          >
            Cerrar Sesión
          </button>
        </div>

        <h2 style={{ fontSize: '1.05rem', marginBottom: '12px', color: '#1e293b' }}>
          📅 Mis Citas Agendadas ({citasDelBarbero.length})
        </h2>

        {citasDelBarbero.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '24px' }}>
            Aún no tienes clientes agendados contigo.
          </p>
        ) : (
          <ul className="lista-citas">
            {citasDelBarbero.map((cita) => (
              <li key={cita.id} className="item-cita">
                <div className="info-cita">
                  <h3>
                    {cita.nombreCliente} — <span style={{ color: '#2563eb' }}>{cita.servicio}</span>
                  </h3>
                  <p>📅 Fecha: {cita.fecha} | ⏰ Hora: {cita.hora}</p>
                  <p>📞 Teléfono: {cita.telefonoCliente}</p>
                </div>
                <button
                  className="boton-cancelar"
                  onClick={() => alCancelarCita(cita.id)}
                >
                  Cancelar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // VISTA CUANDO EL ADMINISTRADOR YA INICIÓ SESIÓN
  if (adminAutenticado) {
    return (
      <div>
        <div
          className="encabezado-portal"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'left'
          }}
        >
          <div>
            <h1>Panel de Administración</h1>
            <p>Alta de barberos y control general de citas</p>
          </div>
          <button
            className="boton-secundario"
            onClick={() => setAdminAutenticado(false)}
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Registrar barbero con usuario y contraseña */}
        <div className="caja-seccion">
          <h2 style={{ fontSize: '1.05rem', marginBottom: '14px', color: '#1e293b' }}>
            ✂️ Registrar Nuevo Barbero
          </h2>
          <form onSubmit={manejarRegistrarBarbero}>
            <div className="grupo-formulario">
              <label>Nombre del Barbero</label>
              <input
                type="text"
                value={nombreBarbero}
                onChange={(e) => setNombreBarbero(e.target.value)}
                placeholder="Ej. Roberto Gómez"
              />
            </div>

            <div className="grupo-formulario">
              <label>Especialidad</label>
              <input
                type="text"
                value={especialidadBarbero}
                onChange={(e) => setEspecialidadBarbero(e.target.value)}
                placeholder="Ej. Fade moderno y Barba"
              />
            </div>

            <div className="grupo-formulario">
              <label>Usuario para Iniciar Sesión</label>
              <input
                type="text"
                value={usuarioBarberoNuevo}
                onChange={(e) => setUsuarioBarberoNuevo(e.target.value)}
                placeholder="Ej. roberto"
              />
            </div>

            <div className="grupo-formulario">
              <label>Contraseña del Barbero</label>
              <input
                type="password"
                value={contrasenaBarberoNueva}
                onChange={(e) => setContrasenaBarberoNueva(e.target.value)}
                placeholder="Crea una contraseña"
              />
            </div>

            <button type="submit" className="boton-reservar">
              Guardar Barbero
            </button>
          </form>

          <div style={{ marginTop: '18px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
            <p style={{ fontSize: '0.84rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
              Barberos registrados ({listaBarberos.length}):
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {listaBarberos.map((barbero) => (
                <span
                  key={barbero.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>
                    ✂️ <strong>{barbero.nombre}</strong> (usuario: <code>{barbero.usuario}</code>)
                  </span>
                  {listaBarberos.length > 1 && (
                    <button
                      onClick={() => alEliminarBarbero(barbero.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                      title="Eliminar barbero"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Todas las citas del negocio */}
        <h2 style={{ fontSize: '1.05rem', marginBottom: '12px', color: '#1e293b' }}>
          📅 Todas las Citas ({listaCitas.length})
        </h2>

        {listaCitas.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>
            No hay citas registradas.
          </p>
        ) : (
          <ul className="lista-citas">
            {listaCitas.map((cita) => {
              const barberoAsignado = listaBarberos.find((b) => b.id === cita.barberoId);
              return (
                <li key={cita.id} className="item-cita">
                  <div className="info-cita">
                    <h3>
                      {cita.nombreCliente} — <span style={{ color: '#2563eb' }}>{cita.servicio}</span>
                    </h3>
                    <p>👨‍🦰 Barbero: <strong>{barberoAsignado ? barberoAsignado.nombre : 'General'}</strong></p>
                    <p>📅 {cita.fecha} | ⏰ {cita.hora} | 📞 {cita.telefonoCliente}</p>
                  </div>
                  <button
                    className="boton-cancelar"
                    onClick={() => alCancelarCita(cita.id)}
                  >
                    Cancelar
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  // PANTALLA DE LOGIN (ADMINISTRADOR O BARBERO)
  return (
    <div>
      <div className="encabezado-portal">
        <h1>Acceso al Equipo</h1>
        <p>Inicia sesión como administrador o como barbero</p>
      </div>

      <div className="pestanas-acceso">
        <button
          type="button"
          className={`boton-pestana ${tipoAcceso === 'admin' ? 'activa' : ''}`}
          onClick={() => setTipoAcceso('admin')}
        >
          🔑 Administrador
        </button>
        <button
          type="button"
          className={`boton-pestana ${tipoAcceso === 'barbero' ? 'activa' : ''}`}
          onClick={() => setTipoAcceso('barbero')}
        >
          ✂️ Barbero
        </button>
      </div>

      {tipoAcceso === 'admin' ? (
        <form onSubmit={manejarLoginAdmin}>
          <div className="grupo-formulario">
            <label>Contraseña de Administrador</label>
            <input
              type="password"
              value={contrasenaAdmin}
              onChange={(e) => setContrasenaAdmin(e.target.value)}
              placeholder="Contraseña (ej. admin123)"
            />
          </div>
          <button type="submit" className="boton-reservar">
            Ingresar como Administrador
          </button>
        </form>
      ) : (
        <form onSubmit={manejarLoginBarbero}>
          <div className="grupo-formulario">
            <label>Usuario de Barbero</label>
            <input
              type="text"
              value={usuarioBarberoLogin}
              onChange={(e) => setUsuarioBarberoLogin(e.target.value)}
              placeholder="Ej. miguel o daniel"
            />
          </div>
          <div className="grupo-formulario">
            <label>Contraseña</label>
            <input
              type="password"
              value={contrasenaBarberoLogin}
              onChange={(e) => setContrasenaBarberoLogin(e.target.value)}
              placeholder="Tu contraseña (ej. 123)"
            />
          </div>
          <button type="submit" className="boton-reservar">
            Ver Mis Citas
          </button>
        </form>
      )}
    </div>
  );
};