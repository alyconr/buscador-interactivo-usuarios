// Imports principales de React
import { useEffect, useState, useCallback } from 'react'
// Cliente HTTP para consumir el backend simulado (JSON Server)
import axios from 'axios'
// Componentes propios
import SearchInput from './components/SearchInput'
import TodoItem from './toDoItem'

// Notificaciones de Ã©xito/error/info
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Spinner de carga
import { CircularProgress } from '@mui/material'
// Contexto de autenticaciÃ³n (usuario logueado y logout)
import { useAuth } from './context/AuthContext'

export default function App() {
  // Estado global de tareas que vienen del backend
  const [tareas, setTareas] = useState([])
  // Controla el input para crear nuevas tareas
  const [input, setInput] = useState("")
  // Bandera de carga general al traer datos de la API
  const [loading, setLoading] = useState(false)
  // Usuario actual y acciÃ³n de salir (logout)
  const { user, logout } = useAuth()
  // Estados para la bÃºsqueda con "delay" visual
  const [buscando, setBuscando] = useState(false)
  const [filtrados, setFiltrados] = useState([])
  const [hayBusqueda, setHayBusqueda] = useState(false)
  // Filtro rÃ¡pido por autor: 'all' | 'cristal' | 'catalina'
  const [authorFilter, setAuthorFilter] = useState('all')



  // API base para JSON Server
  // URL base del JSON Server (ver package.json: script "server-api")
  const API_URL = 'http://localhost:3001'

  // Cargar tareas desde API
  useEffect(() => {
    // Al montar el componente, se consultan las tareas desde la API
    const fetchTasks = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(`${API_URL}/tasks`)
        // Guardamos en estado lo que devuelva el backend (siempre un array)
        setTareas(Array.isArray(data) ? data : [])
      } catch (err) {
        // Si falla, notificamos y dejamos la lista vacÃ­a
        toast.error('Error cargando tareas')
        setTareas([])
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  // Filtrado por texto/autor con pequeÃ±a espera para UX
  const filtrarTareas = useCallback(
    (query) => {
      if (!query.trim()) {
        setFiltrados([])
        setHayBusqueda(false)  // No hay bÃºsqueda activa
        return
      }
      setHayBusqueda(true)  // Hay bÃºsqueda activa
      setBuscando(true)
      setTimeout(() => {
        const q = query.trim().toLowerCase()
        const resultados = tareas.filter((tarea) => {
          const textMatch = tarea.text.toLowerCase().includes(q)
          const authorMatch = (tarea.author || '').toLowerCase().includes(q)
          return textMatch || authorMatch
        })
        // Aplica filtro rÃ¡pido por autor a los resultados
        const resultadosFiltradosPorAutor = authorFilter === 'all'
          ? resultados
          : resultados.filter(t => (t.author || '') === authorFilter)

        setFiltrados(resultadosFiltradosPorAutor)
        setBuscando(false)
        if (resultados.length === 0) {
          toast.info(
            'No se encontraron tareas que coincidan con la bÃºsqueda.',
            {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            }
          )
        }
      }, 500)
    },
    [tareas, authorFilter]
  )

  // Crea una tarea nueva vÃ­a POST a la API
  const agregarTarea = async () => {
    const text = input.trim()
    if (!text) return
    const newTask = {
      text,
      completed: false,
      author: user?.username || 'anon',
      createdBy: user?.username || 'anon',
      createdAt: new Date().toISOString(),
      updatedBy: null,
      updatedAt: null,
    }
    try {
      const { data } = await axios.post(`${API_URL}/tasks`, newTask)
      setTareas((prev) => [...prev, data])
      setInput("")
      toast.success('Tarea creada')
    } catch (err) {
      toast.error('Error creando tarea')
    }
  }

  // Invierte el completado de una tarea y registra quiÃ©n/cuÃ¡ndo editÃ³
  const toggleCompleted = async (id) => {
    const target = tareas.find((t) => t.id === id)
    if (!target) return
    const payload = {
      completed: !target.completed,
      updatedBy: user?.username || 'anon',
      updatedAt: new Date().toISOString(),
    }
    try {
      const { data } = await axios.patch(`${API_URL}/tasks/${id}`, payload)
      setTareas((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)))
    } catch (err) {
      toast.error('Error actualizando tarea')
    }
  };


  // Elimina una tarea por id en la API y en el estado local
  const eliminarTarea = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`)
      setTareas((prev) => prev.filter((t) => t.id !== id))
      toast.success('Tarea eliminada')
    } catch (err) {
      toast.error('Error eliminando tarea')
    }
  }

  // Edita el texto de una tarea y marca metadatos de ediciÃ³n
  const editarTarea = async (id, nuevoTexto) => {
    const payload = {
      text: nuevoTexto,
      updatedBy: user?.username || 'anon',
      updatedAt: new Date().toISOString(),
    }
    try {
      const { data } = await axios.patch(`${API_URL}/tasks/${id}`, payload)
      setTareas((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)))
      toast.success('Tarea actualizada')
    } catch (err) {
      toast.error('Error actualizando tarea')
    }
  }

  // Render principal de la aplicaciÃ³n
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-800">
              Team To-Do
            </h1>
            {user?.username && (
              <div className="mt-1 text-sm text-gray-600">
                Conectado como <span className="font-semibold">{user.username}</span>
              </div>
            )}
          </div>
          <button
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
            onClick={logout}
          >
            Cerrar sesiÃ³n
          </button>
        </div>

        <div className="max-w-2xl mx-auto mb-6">
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm ring-1 ring-gray-200 p-3 sm:p-4">
            {/* Buscador: dispara filtrarTareas(query) */}
            <SearchInput onSearch={filtrarTareas} />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center my-10">
            <CircularProgress />
          </div>
        )}

        {buscando && (
          <div className="flex justify-center items-center my-10">
            <CircularProgress color="primary" />
          </div>
        )}
        {!buscando && hayBusqueda && (
          <div className="mb-10">
            {filtrados.length === 0 ? (
              <div className="text-center text-gray-500 bg-white/70 backdrop-blur rounded-lg py-8 ring-1 ring-gray-200">
                No hay resultados para tu bÃºsqueda.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(authorFilter === 'all' ? filtrados : filtrados.filter(t => (t.author || '') === authorFilter)).map((tarea) => (
                  <TodoItem
                    key={tarea.id}
                    tarea={tarea}
                    toggleCompleted={toggleCompleted}
                    eliminarTarea={eliminarTarea}
                    editarTarea={editarTarea}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="max-w-2xl mx-auto mt-10">
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm ring-1 ring-gray-200 p-4 sm:p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lista de tareas</h2>
            {/* Filtros rÃ¡pidos por autor */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {[
                { key: 'all', label: 'Todos' },
                { key: 'cristal', label: 'cristal' },
                { key: 'catalina', label: 'catalina' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setAuthorFilter(opt.key)}
                  className={`${authorFilter === opt.key ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'} border border-gray-300 px-3 py-1.5 rounded-full text-sm shadow-sm hover:shadow transition`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {/* Input para agregar una nueva tarea */}
            <div className="flex gap-3 mb-5">
              <input
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="AÃ±adir tarea"
              />
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
                onClick={agregarTarea}
              >
                AÃ±adir
              </button>
            </div>

            {/* Render condicional: estado vacÃ­o o lista de tareas */}
            {tareas.length === 0 ? (
              <div className="text-center text-gray-500 py-10">AÃºn no hay tareas. Â¡Agrega la primera!</div>
            ) : (
              <div className="space-y-2">
                {(authorFilter === 'all' ? tareas : tareas.filter(t => (t.author || '') === authorFilter)).map((tarea) => (
                  <TodoItem
                    key={tarea.id}
                    tarea={tarea}
                    toggleCompleted={toggleCompleted}
                    eliminarTarea={eliminarTarea}
                    editarTarea={editarTarea}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}



