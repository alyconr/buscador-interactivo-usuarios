// Campo de búsqueda reutilizable con "debounce"
// - onSearch: función que recibe el texto a buscar después de 500ms sin escribir.
import { useEffect, useState } from 'react'

export default function SearchInput({ onSearch }) {
  // Estado controlado del texto del input
  const [query, setQuery] = useState('')

  useEffect(() => {
    // Debounce: esperamos 500ms desde la última tecla antes de disparar onSearch
    const timeout = setTimeout(() => {
      onSearch(query)
    }, 500)

    // Limpiamos el timeout si el usuario sigue escribiendo o el componente se desmonta
    return () => clearTimeout(timeout)
  }, [query, onSearch])

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="text"
      placeholder="Buscar por texto o autor..."
    />
  )
}