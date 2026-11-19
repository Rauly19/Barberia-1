// src/components/RegistroBarbero.tsx
import React, { useState } from 'react';
import type { Barbero } from '../App';

interface RegistroBarberoProps {
  alRegistrarBarbero: (barbero: Barbero) => void;
}

export const RegistroBarbero: React.FC<RegistroBarberoProps> = ({ alRegistrarBarbero }) => {
  const [nombre, setNombre] = useState<string>('');
  const [especialidad, setEspecialidad] = useState<string>('');

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !especialidad.trim()) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const nuevoBarbero: Barbero = {
      id: Date.now(),
      nombre,
      especialidad
    };

    alRegistrarBarbero(nuevoBarbero);
    alert('¡Te has registrado como barbero con éxito!');
  };

  return (
    <div>
      <div className="encabezado-portal">
        <h1>Registro de Barberos</h1>
        <p>Únete a nuestro equipo y comienza a recibir citas</p>
      </div>

      <form onSubmit={manejarEnvio}>
        <div className="grupo-formulario">
          <label>Nombre Completo</label>
          <input 
            type="text" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Roberto Gómez"
          />
        </div>

        <div className="grupo-formulario">
          <label>Especialidad</label>
          <input 
            type="text" 
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            placeholder="Ej. Fade moderno, Barbas"
          />
        </div>

        <button type="submit" className="boton-reservar">
          Registrarme como Barbero
        </button>
      </form>
    </div>
  );
};