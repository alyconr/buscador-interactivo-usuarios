// Contexto de Autenticación simulado
// - Guarda el usuario actual y provee login/logout
// - Persiste en localStorage para mantener sesión al recargar
// - Sincroniza login/logout entre pestañas usando el evento 'storage'
import React, { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  // user = { username: 'cristal' | 'catalina' } o null si no está logueado
  const [user, setUser] = useState(() => {
    // Rehidrata el usuario desde localStorage al montar
    try {
      const stored = localStorage.getItem('auth_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const navigate = useNavigate()

  const login = (username, password) => {
    // Autenticación simulada (2 usuarios válidos)
    if (username === 'cristal' && password === '1234') {
      const u = { username: 'cristal' }
      setUser(u)
      localStorage.setItem('auth_user', JSON.stringify(u))
      toast.success('Login exitoso!')
      navigate('/usuarios')
    } else if (username === 'catalina' && password === '4567') {
      const u = { username: 'catalina' }
      setUser(u)
      localStorage.setItem('auth_user', JSON.stringify(u))
      toast.success('Login exitoso!')
      navigate('/usuarios')
    } else {
      toast.error('Credenciales incorrectas')
    }
  }


  const logout = () => {
    // Limpia sesión local y redirige a login
    setUser(null)
    localStorage.removeItem('auth_user')
    navigate('/login')
  }

  // Sincroniza auth entre pestañas: si otra pestaña modifica 'auth_user', actualizamos este estado
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'auth_user') {
        try {
          const next = e.newValue ? JSON.parse(e.newValue) : null
          setUser(next)
        } catch {
          setUser(null)
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook de conveniencia para consumir el contexto
export function useAuth() {
  return useContext(AuthContext)
}