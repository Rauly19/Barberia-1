import React, { useState } from 'react';
import type { Barbero, Cita } from '../App';

interface PortalClienteProps {
  listaCitas: Cita[];
  listaBarberos: Barbero[];
  alRegistrarCita: (cita: Cita) => void;
}

export const PortalCliente: React.FC<PortalClienteProps> = ({
  listaCitas,
  listaBarberos,
  alRegistrarCita
}) => {
  const [nombreCliente, setNombreCliente] = useState<string>('');
  const [telefonoCliente, setTelefonoCliente] = useState<string>('');
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>('Corte Clásico');
  const [barberoSeleccionado, setBarberoSeleccionado] = useState<number>(listaBarberos[0]?.id || 1);
  const [fechaCita, setFechaCita] = useState<string>('');
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>('');
  const [citaConfirmada, setCitaConfirmada] = useState<Cita | null>(null);

  const horariosTotales = [
    '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const horasOcupadas = listaCitas
    .filter((cita) => cita.fecha === fechaCita && cita.barberoId === Number(barberoSeleccionado))
    .map((cita) => cita.hora);

  const manejarEnvio = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (!fechaCita) {
      alert('Por favor selecciona una fecha en el calendario.');
      return;
    }

    if (!horaSeleccionada) {
      alert('Por favor selecciona un horario disponible.');
      return;
    }

    if (nombreCliente.trim() === '' || telefonoCliente.trim() === '') {
      alert('Por favor completa tu nombre y número de teléfono.');
      return;
    }

    const nuevaCita: Cita = {
      id: Date.now(),
      nombreCliente,
      telefonoCliente,
      servicio: servicioSeleccionado,
      barberoId: Number(barberoSeleccionado),
      fecha: fechaCita,
      hora: horaSeleccionada,
    };

    alRegistrarCita(nuevaCita);
    setCitaConfirmada(nuevaCita);
  };

  if (citaConfirmada) {
    const barberoAsignado = listaBarberos.find((b) => b.id === citaConfirmada.barberoId);

    return (
      <div className="seccion-exito">
        <h2>¡Cita Agendada con Éxito! 🎉</h2>
        <p style={{ color: '#64748b', marginBottom: '15px', fontSize: '0.95rem' }}>
          Te esperamos en la barbería, <strong>{citaConfirmada.nombreCliente}</strong>.
        </p>
        <div className="tarjeta-resumen">
          <p>✂️ <strong>Servicio:</strong> {citaConfirmada.servicio}</p>
          <p>👨‍🦰 <strong>Barbero:</strong> {barberoAsignado ? barberoAsignado.nombre : 'General'}</p>
          <p>📅 <strong>Fecha:</strong> {citaConfirmada.fecha}</p>
          <p>⏰ <strong>Hora:</strong> {citaConfirmada.hora}</p>
          <p>📞 <strong>Teléfono:</strong> {citaConfirmada.telefonoCliente}</p>
        </div>
        <button
          className="boton-secundario"
          onClick={() => {
            setCitaConfirmada(null);
            setNombreCliente('');
            setTelefonoCliente('');
            setFechaCita('');
            setHoraSeleccionada('');
          }}
        >
          Agendar otra cita
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="encabezado-portal">
        <h1>Reservaciones en Línea</h1>
        <p>Elige tu barbero, selecciona fecha y aparta tu horario</p>
      </div>

      <form onSubmit={manejarEnvio}>
        <div className="grupo-formulario">
          <label>1. Selecciona el Barbero</label>
          <select
            value={barberoSeleccionado}
            onChange={(e) => {
              setBarberoSeleccionado(Number(e.target.value));
              setHoraSeleccionada('');
            }}
          >
            {listaBarberos.map((barbero) => (
              <option key={barbero.id} value={barbero.id}>
                {barbero.nombre} — ({barbero.especialidad})
              </option>
            ))}
          </select>
        </div>

        <div className="grupo-formulario">
          <label>2. Selecciona la Fecha</label>
          <div className="contenedor-calendario-input">
            <input
              type="date"
              value={fechaCita}
              onChange={(e) => {
                setFechaCita(e.target.value);
                setHoraSeleccionada('');
              }}
            />
            <svg className="icono-calendario-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {fechaCita && (
          <div className="grupo-formulario">
            <label>3. Horarios Disponibles</label>
            <div className="grid-horarios">
              {horariosTotales.map((hora) => {
                const estaOcupado = horasOcupadas.includes(hora);
                const estaSeleccionado = horaSeleccionada === hora;

                let claseBoton = 'boton-horario';
                if (estaOcupado) claseBoton += ' ocupado';
                else if (estaSeleccionado) claseBoton += ' seleccionado';
                else claseBoton += ' disponible';

                return (
                  <button
                    type="button"
                    key={hora}
                    disabled={estaOcupado}
                    onClick={() => setHoraSeleccionada(hora)}
                    className={claseBoton}
                  >
                    {hora} {estaOcupado ? '(Ocupado)' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grupo-formulario">
          <label>4. Selecciona el Servicio</label>
          <select
            value={servicioSeleccionado}
            onChange={(e) => setServicioSeleccionado(e.target.value)}
          >
            <option value="Corte Clásico">Corte Clásico</option>
            <option value="Corte + Barba">Corte + Barba</option>
            <option value="Afeitado Tradicional">Afeitado Tradicional</option>
            <option value="Diseño de Barba">Diseño de Barba</option>
          </select>
        </div>

        <div className="grupo-formulario">
          <label>5. Tu Nombre Completo</label>
          <input
            type="text"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            placeholder="Ej. Carlos Pérez"
          />
        </div>

        <div className="grupo-formulario">
          <label>6. Tu Teléfono de Contacto</label>
          <input
            type="tel"
            value={telefonoCliente}
            onChange={(e) => setTelefonoCliente(e.target.value)}
            placeholder="Ej. 5512345678"
          />
        </div>

        <button type="submit" className="boton-reservar">
          Confirmar mi Cita
        </button>
      </form>
    </div>
  );
};