import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  roleColor: string
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@quantic.store',
    avatar: '/avatars/admin.jpg',
    role: 'Administrador',
    roleColor: '#ff2d95',
    permissions: ['all'],
  },
  {
    id: '2',
    name: 'Moderador',
    email: 'mod@quantic.store',
    avatar: '/avatars/mod.jpg',
    role: 'Moderador',
    roleColor: '#b347d9',
    permissions: ['products', 'orders', 'users', 'content'],
  },
  {
    id: '3',
    name: 'Suporte',
    email: 'suporte@quantic.store',
    avatar: '/avatars/suporte.jpg',
    role: 'Suporte',
    roleColor: '#4488ff',
    permissions: ['orders', 'users'],
  },
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('quantic_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = useCallback((email: string, password: string) => {
    const found = defaultUsers.find(u => u.email === email)
    if (found && password === '123456') {
      setUser(found)
      localStorage.setItem('quantic_user', JSON.stringify(found))
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('quantic_user')
  }, [])

  const isAdmin = user?.role === 'Administrador'
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
