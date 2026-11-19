import { useState } from 'react';
import { PortalCliente } from './components/PortalCliente';
import { PanelAdmin } from './components/PanelAdmin';
import './App.css';

export interface Barbero {
  id: number;
  nombre: string;
  especialidad: string;
}

export interface Cita {
  id: number;
  nombreCliente: string;
  telefonoCliente: string;
  servicio: string;
  barberoId: number;
  fecha: string;
  hora: string;
}

export function App() {
  const [listaBarberos, setListaBarberos] = useState<Barbero[]>([
    { id: 1, nombre: 'Miguel "El Fino" Ángel', especialidad: 'Cortes clásicos y Barba' },
    { id: 2, nombre: 'Daniel Rivas', especialidad: 'Fade moderno y Diseños' }
  ]);

  const [listaCitas, setListaCitas] = useState<Cita[]>([
    {
      id: 1,
      nombreCliente: 'Carlos Pérez',
      telefonoCliente: '5512345678',
      servicio: 'Corte + Barba',
      barberoId: 1,
      fecha: '2026-11-25',
      hora: '11:00'
    }
  ]);

  const [plataformaActual, setPlataformaActual] = useState<'cliente' | 'admin'>('cliente');

  const registrarCita = (nuevaCita: Cita) => {
    setListaCitas([nuevaCita, ...listaCitas]);
  };

  const cancelarCita = (idCita: number) => {
    const citasFiltradas = listaCitas.filter((cita) => cita.id !== idCita);
    setListaCitas(citasFiltradas);
  };

  const registrarNuevoBarbero = (barbero: Barbero) => {
    setListaBarberos([...listaBarberos, barbero]);
  };

  const eliminarBarbero = (idBarbero: number) => {
    setListaBarberos(listaBarberos.filter((b) => b.id !== idBarbero));
  };

  return (
    <div className="contenedor-principal">
      {/* Selector superior limpio para separar completamente las plataformas */}
      <nav className="barra-navegacion">
        <button 
          className={`enlace-nav ${plataformaActual === 'cliente' ? 'activo' : ''}`}
          onClick={() => setPlataformaActual('cliente')}
        >
          📅 Portal de Citas (Clientes)
        </button>
        <button 
          className={`enlace-nav ${plataformaActual === 'admin' ? 'activo' : ''}`}
          onClick={() => setPlataformaActual('admin')}
        >
          🔑 Administración & Barberos
        </button>
      </nav>

      <main>
        {plataformaActual === 'cliente' ? (
          <PortalCliente 
            listaCitas={listaCitas}
            listaBarberos={listaBarberos}
            alRegistrarCita={registrarCita}
          />
        ) : (
          <PanelAdmin 
            listaCitas={listaCitas}
            listaBarberos={listaBarberos}
            alCancelarCita={cancelarCita}
            alRegistrarBarbero={registrarNuevoBarbero}
            alEliminarBarbero={eliminarBarbero}
          />
        )}
      </main>
    </div>
  );
}

export default App;