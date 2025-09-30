// Componente que representa una tarjeta de tarea individual
import { useState } from 'react';
import { TrashIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/solid';

export default function ToDoItem({ tarea, toggleCompleted, eliminarTarea, editarTarea }) {
  // Estado local para alternar entre ver y editar el texto
  const [modoEdicion, setModoEdicion] = useState(false);
  // Controla el input de edición cuando la tarjeta está en modo edición
  const [nuevoTexto, setNuevoTexto] = useState(tarea.text);

  // Utilidad: convierte una fecha ISO a una frase corta "hace X tiempo"
  const timeAgo = (iso) => {
    try {
      const ms = Date.now() - new Date(iso).getTime();
      const s = Math.floor(ms / 1000);
      if (s < 60) return `${s} s`;
      const m = Math.floor(s / 60);
      if (m < 60) return `${m} m`;
      const h = Math.floor(m / 60);
      if (h < 24) return `${h} h`;
      const d = Math.floor(h / 24);
      return `${d} d`;
    } catch {
      return '';
    }
  }

  // Envía al padre la edición del texto y cierra modo edición
  const guardarCambios = () => {
    if (nuevoTexto.trim()) {
      editarTarea(tarea.id, nuevoTexto.trim());
      setModoEdicion(false);
    }
  };

  return (
    // Tarjeta visual con animación sutil al hacer hover
    <div className="flex items-center gap-3 justify-between p-3 rounded-lg border border-gray-200 bg-white/80 backdrop-blur shadow transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-2 flex-1">
        <input
          className="w-4 h-4"
          type="checkbox"
          checked={tarea.completed}
          // Marca como completada/no completada
          onChange={() => toggleCompleted(tarea.id)}
        />

        {modoEdicion ? (
          <input
            className="flex-1 border p-1 rounded"
            value={nuevoTexto}
            onChange={(e) => setNuevoTexto(e.target.value)}
          />
        ) : (
          <div className="flex flex-col">
            {/* Autor visible bajo el título */}
            <span className="text-xs text-gray-500">Autor: {tarea.author ?? 'desconocido'}</span>
            <span className={tarea.completed ? 'line-through text-gray-400' : ''}>
              {tarea.text}
            </span>
            {tarea.updatedAt && (
              <span className="text-[11px] text-gray-400">Editado por {tarea.updatedBy ?? 'alguien'} hace {timeAgo(tarea.updatedAt)}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {modoEdicion ? (
          <button onClick={guardarCambios} title="Guardar">
            <CheckIcon className="w-6 h-6 text-green-600 hover:text-green-800" />
          </button>
        ) : (
          <button onClick={() => setModoEdicion(true)} title="Editar">
            <PencilIcon className="w-6 h-6 text-blue-600 hover:text-blue-800" />
          </button>
        )}

        <button onClick={() => eliminarTarea(tarea.id)} title="Eliminar">
          <TrashIcon className="w-6 h-6 text-red-600 hover:text-red-800" />
        </button>
      </div>
    </div>
  );
}